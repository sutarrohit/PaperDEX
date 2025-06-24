# ================================================
# Stage 1: Base image with common dependencies
# ================================================
FROM node:18-alpine AS base
# Use Alpine for smaller image size
WORKDIR /app

# ================================================
# Stage 2: Builder stage - prepares dependencies
# ================================================
FROM base AS builder

# Update and install required system dependencies
RUN apk update && apk add --no-cache libc6-compat

# Install pnpm and turbo globally for monorepo management
RUN npm install -g pnpm turbo

# Copy all files from the host to the container
COPY . .

# Prune the monorepo to only include necessary dependencies for the order-service
RUN turbo prune @paperdex/user-service --docker

# ================================================
# Stage 3: Installer stage - installs dependencies
# ================================================
FROM base AS installer

# Update and install required system dependencies
RUN apk update && apk add --no-cache libc6-compat

# Install pnpm globally
RUN npm install -g pnpm

# Copy pruned package.json files from builder
COPY --from=builder /app/out/json/ .

# Install all dependencies
RUN pnpm install

# Copy full source code from builder
COPY --from=builder /app/out/full/ .

# Build the application
RUN pnpm turbo build

# ================================================
# Stage 4: Runner stage - production ready image
# ================================================
FROM base AS runner

# Install pnpm globally (needed to run the application)
RUN npm install -g pnpm

# Create non-root user for security
RUN addgroup --system --gid 1001 expressjs && \
    adduser --system --uid 1001 expressjs

# Switch to non-root user
USER expressjs

# Copy built application from installer stage
COPY --from=installer /app .

# Start the application
CMD ["node", "packages/user-service/dist/server.js"]