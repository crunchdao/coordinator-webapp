# Stage 1 — build
FROM node:25-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build -- --webpack

# Stage 2 — run
FROM node:25-alpine AS runtime
WORKDIR /app

COPY --from=build /app ./

EXPOSE 3000
CMD ["npm", "start"]