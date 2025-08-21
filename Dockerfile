# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

ARG NODE_ENV
ARG PORT
ARG OPENAI_API_KEY
ARG PUBLIC_DATA_PORTAL_API_KEY_DECODING
ARG PUBLIC_DATA_PORTAL_API_KEY_ENCODING
ARG PUBLIC_DATA_PORTAL_API_KEY_ENCODING
ARG DATABASE_PWD
ARG DATABASE_SCHEMA
ARG DATABASE_PORT
ARG DATABASE_USER
ARG DATABASE_HOST

# Environment variables
ENV NODE_ENV=$NODE_ENV \
    PORT=$PORT \
    OPENAI_API_KEY=$OPENAI_API_KEY \
    PUBLIC_DATA_PORTAL_API_KEY_DECODING=$PUBLIC_DATA_PORTAL_API_KEY_DECODING \
    PUBLIC_DATA_PORTAL_API_KEY_ENCODING=$PUBLIC_DATA_PORTAL_API_KEY_ENCODING \
    PUBLIC_DATA_PORTAL_API_KEY_ENCODING=$PUBLIC_DATA_PORTAL_API_KEY_ENCODING \
    DATABASE_PWD=$DATABASE_PWD \
    DATABASE_SCHEMA=$DATABASE_SCHEMA \
    DATABASE_PORT=$DATABASE_PORT \
    DATABASE_USER=$DATABASE_USER \
    DATABASE_HOST=$DATABASE_HOST

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health-check.js || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]