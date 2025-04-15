FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl

# Install dependencies only when needed
FROM base AS deps
COPY package*.json ./
COPY packages packages
COPY apps/backend/package.json ./apps/backend/package.json
RUN npm ci

# Setup development dependencies for Prisma
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY . .

# Generate Prisma client
RUN cd apps/backend && npx prisma generate

# Build the backend
RUN npm run build --workspace=@tixgenius/backend

# Production image, copy all the files and run
FROM base AS runner
WORKDIR /app

# Only copy necessary files
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package.json ./package.json

# Not running as root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 expressjs \
    && chown -R expressjs:nodejs /app
USER expressjs

# Generate Prisma client at runtime
RUN npx prisma generate

EXPOSE 3001

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Create startup script
RUN echo '#!/bin/sh\n\
npx prisma migrate deploy\n\
node dist/index.js\n\
' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"] 