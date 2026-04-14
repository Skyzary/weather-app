## Base image
FROM node:20-alpine AS base
WORKDIR /app
RUN npm i -g pnpm
COPY  package*.json ./
RUN pnpm i
## Test stage
FROM base AS test-stage
COPY . .
RUN pnpm run test --coverage
## Build stage
FROM base AS build-stage
ARG VITE_API_KEY
ARG VITE_UNSPLASH_ACCESS_KEY
ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_UNSPLASH_ACCESS_KEY=$VITE_UNSPLASH_ACCESS_KEY
COPY . .
RUN pnpm run build
## Nginx setup
FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

