#!/bin/bash
#
# dirt-rally2-laptimes runs as Quadlet units, not as hand-created Podman containers.
#
# The pod and container definitions live in the homelab-ai repo:
#   homelab-ai/config/quadlet/dirt-rally2-laptimes.pod
#   homelab-ai/config/quadlet/dirt-rally2-laptimes-{postgres,api,app,adminer}.container
#
# Creating the pod with `podman pod create` / `podman generate systemd` here would
# fight with Quadlet on the next boot, so this script only (re)starts the units
# that Quadlet generates.
#
# `deploy.sh` does NOT call this — it only restarts dirt-rally2-laptimes-app.service
# after loading a new image, so Postgres and the API stay up during a UI deploy.
#
# Use this after changing the Quadlet definitions, or to recreate everything.
#
set -euo pipefail

UNITS=(
  dirt-rally2-laptimes-pod.service
  dirt-rally2-laptimes-postgres.service
  dirt-rally2-laptimes-api.service
  dirt-rally2-laptimes-app.service
  dirt-rally2-laptimes-adminer.service
)

echo ">> restarting Quadlet units for dirt-rally2-laptimes"
for u in "${UNITS[@]}"; do
  printf '   %-40s ' "$u"
  systemctl --user restart "$u"
  systemctl --user is-active "$u"
done

echo ""
echo ">> running containers:"
podman ps --pod --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
