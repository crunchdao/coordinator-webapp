# Stage 1 — build
FROM node:25-alpine AS build
WORKDIR /app

RUN apk add --no-cache python3 make g++ pkgconfig libusb-dev linux-headers eudev-dev
RUN npm install -g pnpm

COPY . .
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV WEBPACK_CACHE=false

ARG NEXT_PUBLIC_API_URL_MODEL_ORCHESTRATOR
ENV NEXT_PUBLIC_API_URL_MODEL_ORCHESTRATOR=${NEXT_PUBLIC_API_URL_MODEL_ORCHESTRATOR}

RUN pnpm --filter=@coordinator/platform build

# Stage 2 — run
FROM node:25-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache docker-cli
RUN npm install -g pnpm

COPY --from=build /app ./

EXPOSE 3000
CMD ["pnpm", "--filter=@coordinator/platform", "start"]
