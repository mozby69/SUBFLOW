FROM node:24-bookworm-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

# Build the shared workspace package first
RUN pnpm --filter @repo/shared build

# Generate Prisma Client
RUN DATABASE_URL="mysql://placeholder:placeholder@localhost:3306/placeholder" \
    pnpm --filter api exec prisma generate

# Build Express API
RUN pnpm --filter api build

FROM node:24-bookworm-slim AS runner

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 5000

CMD ["pnpm", "--filter", "api", "start"]