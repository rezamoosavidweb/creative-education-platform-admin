# syntax=docker/dockerfile:1

FROM node:24-slim AS build
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm rebuild esbuild

COPY . .
ARG VITE_API_URL=/api
ARG VITE_API_TIMEOUT_MS=30000
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_TIMEOUT_MS=$VITE_API_TIMEOUT_MS
RUN pnpm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
