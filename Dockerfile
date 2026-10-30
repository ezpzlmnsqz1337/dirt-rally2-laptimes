FROM docker.io/library/node:18-slim AS build

WORKDIR /app

COPY . /app

RUN npm ci && npm run build


FROM docker.io/library/nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
