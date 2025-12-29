# Stage 1 — build
FROM node:25-alpine AS build
WORKDIR /app

RUN apk add --no-cache python3 make g++ pkgconfig libusb-dev linux-headers eudev-dev

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV WEBPACK_CACHE=false

RUN npm run build -- --webpack

# Stage 2 — run
FROM node:25-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache docker-cli

COPY --from=build /app ./

EXPOSE 3000
CMD ["npm", "start"]
