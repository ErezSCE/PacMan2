# ---------- Build Stage ----------
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
# Disable strict SSL for corporate proxy environments
RUN npm config set strict-ssl false && npm ci --omit=dev --ignore-scripts

# Copy source files
COPY . .

# Build the Vite application (produces ./dist)
RUN npm run build

# ---------- Runtime Stage ----------
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health‑check – ensure the index page is served
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost || exit 1
