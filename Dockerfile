FROM node:18-slim AS build

WORKDIR /app

COPY . /app

RUN npm ci && npm run build


FROM nginx
COPY --from=build /app/dist /usr/share/nginx/html
