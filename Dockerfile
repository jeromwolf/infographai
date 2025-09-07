# Multi-stage Dockerfile for InfoGraphAI
# Production-ready container image

# Stage 1: Base dependencies
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat ffmpeg
WORKDIR /app

# Install turbo globally
RUN npm install -g turbo

# Stage 2: Dependencies installation
FROM base AS deps
COPY package.json package-lock.json turbo.json ./
COPY apps/*/package.json apps/*/
COPY packages/*/package.json packages/*/

# Install dependencies
RUN npm ci

# Stage 3: Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build all packages and apps
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# Stage 4: API Runner
FROM base AS api-runner
WORKDIR /app

# Install production dependencies only
RUN apk add --no-cache postgresql-client redis

# Copy built application
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/*/dist ./packages/*/dist
COPY --from=builder /app/packages/*/package.json ./packages/*/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/turbo.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    mkdir -p /app/output/videos /app/logs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

CMD ["node", "apps/api/dist/index.js"]

# Stage 5: Web Runner
FROM base AS web-runner
WORKDIR /app

# Copy built Next.js application
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/turbo.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

CMD ["npm", "run", "start", "--workspace=apps/web"]