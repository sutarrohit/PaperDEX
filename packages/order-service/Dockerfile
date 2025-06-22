# Use the official Node.js image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml .npmrc ./
COPY packages/db/package.json ./packages/db/
COPY packages/lib/package.json ./packages/lib/
COPY packages/order-service/package.json ./packages/order-service/

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build dependencies
RUN pnpm run build --filter=db... --filter=lib...

# Build order service
RUN pnpm run build --filter=order-service

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built files
COPY --from=builder /app/packages/order-service/dist ./dist
COPY --from=builder /app/packages/order-service/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=builder /app/packages/lib/node_modules ./packages/lib/node_modules

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["node", "dist/server.js"]