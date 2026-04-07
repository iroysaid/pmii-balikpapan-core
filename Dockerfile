FROM node:20-bookworm-slim AS base

# Install OpenSSL for Prisma compatibility
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# 1. Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables must be present at build time
# for next build (e.g. DATABASE_URL)
ENV DATABASE_URL="file:./dev.db"
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma Client
RUN npx prisma generate

# Sync schema to existing dev.db (preserves existing data)
RUN npx prisma db push --accept-data-loss

RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy essential files for standalone mode
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin

# Copy database file (seeded dev.db from local)
COPY --from=builder --chown=nextjs:nodejs /app/dev.db ./dev.db

# Ensure uploads directory exists and has correct permissions
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads && chmod -R 777 /app/public/uploads

# Set permission for database
RUN chmod 777 /app/dev.db

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Note: standalone mode uses server.js directly
CMD ["node", "server.js"]
