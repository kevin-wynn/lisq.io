# ─── LISQ — Self-hosted lists & notes app ───────────────────────
# Multi-stage build for minimal production image (~150MB)
#
# Build:   docker build -t lisq .
# Run:     docker run -p 4321:4321 -v ./data:/data -e LISQ_USERNAME=admin -e LISQ_PASSWORD=secret lisq
# Compose: docker compose up -d
#
# Environment variables:
#   LISQ_USERNAME  — Admin username (enables auth when set with LISQ_PASSWORD)
#   LISQ_PASSWORD  — Admin password (bcrypt hashed, updated if changed)
#   DATABASE_PATH  — SQLite file path inside container (default: /data/lisq.db)
#   HOST           — Bind address (default: 0.0.0.0)
#   PORT           — Server port (default: 4321)
#
# Volume: Mount a host directory to /data to persist your database.
#         The SQLite file is auto-created on first run.
# ─────────────────────────────────────────────────────────────────

FROM node:20-alpine AS base
WORKDIR /srv

# Stage 1: Install production dependencies
FROM base AS deps
COPY app/package.json app/package-lock.json* ./
RUN npm install --legacy-peer-deps

# Stage 2: Build the Astro SSR app
FROM base AS build
COPY --from=deps /srv/node_modules ./node_modules
COPY app/ .
RUN npm run build

# Stage 3: Production runtime
FROM base AS runtime
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
ENV DATABASE_PATH=/data/lisq.db

COPY --from=build /srv/node_modules ./node_modules
COPY --from=build /srv/dist ./dist

# Copy entrypoint script
COPY docker-entrypoint.sh /srv/docker-entrypoint.sh
RUN chmod +x /srv/docker-entrypoint.sh

# Create data directory for SQLite database
RUN mkdir -p /data

EXPOSE ${PORT}

ENTRYPOINT ["/srv/docker-entrypoint.sh"]
