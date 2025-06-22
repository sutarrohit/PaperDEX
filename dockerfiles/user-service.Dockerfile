# FROM node:18-alpine

# # Install pnpm globally
# RUN npm install -g pnpm

# WORKDIR /app/packages/user-service

# # 1. Copy root config files first
# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# # 2. Copy all package.json files
# COPY packages/db/package.json ./packages/db/
# COPY packages/lib/package.json ./packages/lib/
# COPY packages/user-service/package.json ./packages/user-service/
# COPY packages/eslint-config/package.json ./packages/eslint-config/
# COPY packages/typescript-config/package.json ./packages/typescript-config/

# # 3. Install dependencies (creates workspace links)
# RUN pnpm install --frozen-lockfile

# # 4. Copy all source code
# COPY packages/ ./packages/

# # 5. Build the user-service
# RUN cd packages/user-service && \
#     pnpm run build

# EXPOSE 4001
# CMD ["pnpm", "run", "start"]



# Stage 1: Builder - Install dependencies and build
FROM node:18-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# 1. Copy root config files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 2. Copy all package.json files
COPY packages/db/package.json ./packages/db/
COPY packages/lib/package.json ./packages/lib/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/user-service/package.json ./packages/user-service/

# 3. Install dependencies (creates workspace links)
RUN pnpm install --frozen-lockfile --prod=false

# 4. Copy all source code
COPY packages/ ./packages/

# 5. Build the user-service
RUN cd packages/user-service && pnpm install && \
    pnpm run build

# Stage 2: Runtime - Minimal production image
FROM node:18-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nodejs -G nodejs
USER nodejs

# Copy only production files
COPY --from=builder --chown=nodejs:nodejs /app/packages/user-service/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/packages/user-service/package.json .
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Runtime configuration
ENV NODE_ENV=production
EXPOSE 4001
CMD ["node", "dist/server.js"]