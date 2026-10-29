FROM node:24-bookworm-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @repo/shared build

# Receive environment variables during build
ARG NEXT_PUBLIC_BACKEND_LAN_URL
ARG NEXT_PUBLIC_BACKEND_APP_URL

ENV NEXT_PUBLIC_BACKEND_LAN_URL=$NEXT_PUBLIC_BACKEND_LAN_URL
ENV NEXT_PUBLIC_BACKEND_APP_URL=$NEXT_PUBLIC_BACKEND_APP_URL

# Build Next.js
RUN pnpm --filter web build

FROM node:24-bookworm-slim AS runner

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3100

CMD ["pnpm", "--filter", "web", "start"]