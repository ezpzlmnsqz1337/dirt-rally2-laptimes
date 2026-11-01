FROM docker.io/library/node:18-slim AS build

WORKDIR /app

COPY . /app

# Vite inlines VITE_* values at build time. Empty defaults keep the build
# working without credentials — the map then renders the themed placeholder.
ARG VITE_GOOGLE_MAPS_API_KEY=""
ARG VITE_GOOGLE_MAPS_MAP_ID=""
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY VITE_GOOGLE_MAPS_MAP_ID=$VITE_GOOGLE_MAPS_MAP_ID

RUN npm ci && npm run build


FROM docker.io/library/nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY deployment/nginx-default.conf /etc/nginx/conf.d/default.conf
