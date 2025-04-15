FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package*.json ./
COPY packages packages
COPY apps/frontend/package.json ./apps/frontend/package.json
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY . .

# Next.js collects anonymous usage data - disable it
ENV NEXT_TELEMETRY_DISABLED 1

# Build the app
RUN npm run build --workspace=@tixgenius/frontend

# Production image, copy all the files and run
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Not running as root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs \
    && chown -R nextjs:nodejs /app
USER nextjs

COPY --from=builder /app/apps/frontend/next.config.js ./
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"] 