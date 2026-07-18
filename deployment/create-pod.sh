#!/bin/bash

HOSTING_PC_IP="${HOSTING_PC_IP:-192.168.0.102}"

APP_HOST_PORT="${APP_HOST_PORT:-8090}"
APP_CONTAINER_PORT="${APP_CONTAINER_PORT:-8080}"
ADMINER_HOST_PORT="${ADMINER_HOST_PORT:-8081}"
ADMINER_CONTAINER_PORT="${ADMINER_CONTAINER_PORT:-80}"
POSTGREST_PORT="${POSTGREST_PORT:-3001}"
POSTGREST_CONTAINER_PORT="${POSTGREST_CONTAINER_PORT:-3000}"

export HOSTING_PC_IP POSTGREST_PORT

systemctl --user stop pod-dirt-rally2-laptimes.service

podman pod create --name dirt-rally2-laptimes \
  -p "${APP_HOST_PORT}:${APP_CONTAINER_PORT}" \
  -p "${ADMINER_HOST_PORT}:${ADMINER_CONTAINER_PORT}" \
  -p "${POSTGREST_PORT}:${POSTGREST_CONTAINER_PORT}"

podman volume exists dirt-rally2-laptimes-pgdata || podman volume create dirt-rally2-laptimes-pgdata

if ! podman secret ls --format "{{.Name}}" | grep -q "^pg_pass$"; then
  echo "Secret 'pg_pass' not found. Please enter the PostgreSQL password:"
  read -r -s -p "Password: " PG_PASSWORD
  echo ""
  echo -n "${PG_PASSWORD}" | podman secret create pg_pass -
  echo "Secret 'pg_pass' created successfully."
else
  echo "Secret 'pg_pass' already exists, skipping creation."
fi

podman run -d \
  --name dirt-rally2-laptimes-postgres \
  --pod dirt-rally2-laptimes \
  --memory=512m \
  --memory-swap=512m \
  -v dirt-rally2-laptimes-pgdata:/var/lib/postgresql/data \
  --secret pg_pass,type=mount,target=/run/secrets/pg_pass \
  -e POSTGRES_PASSWORD_FILE=/run/secrets/pg_pass \
  -e POSTGRES_SHARED_BUFFERS=128MB \
  -e POSTGRES_EFFECTIVE_CACHE_SIZE=256MB \
  docker.io/library/postgres:17

podman run -d \
  --name dirt-rally2-laptimes-adminer \
  --pod dirt-rally2-laptimes \
  --memory=128m \
  docker.io/library/adminer:5

podman run -d \
  --name dirt-rally2-laptimes-app \
  --pod dirt-rally2-laptimes \
  --memory=256m \
  localhost/dirt-rally2-laptimes:latest

DB_PASSWORD=$(podman run --rm --secret pg_pass,type=mount,target=/run/secrets/pg_pass alpine cat /run/secrets/pg_pass)

podman run -d \
  --name dirt-rally2-laptimes-api \
  --pod dirt-rally2-laptimes \
  --memory=128m \
  -e PGRST_DB_URI="postgres://postgres:${DB_PASSWORD}@localhost:5432/postgres" \
  -e PGRST_DB_SCHEMA=public \
  -e PGRST_DB_ANON_ROLE=postgres \
  -e PGRST_DB_CHANNEL_ENABLED=false \
  -e PGRST_OPENAPI_SERVER_PROXY_URI="http://${HOSTING_PC_IP}:${POSTGREST_PORT}" \
  docker.io/postgrest/postgrest:latest

podman generate systemd --new --name dirt-rally2-laptimes --files --restart-policy=always
mv *.service ~/.config/systemd/user
systemctl --user daemon-reload
systemctl --user enable --now pod-dirt-rally2-laptimes.service
