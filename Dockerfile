# Stage 1 — build the Svelte app
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2 — run the Express server
FROM node:22-alpine

WORKDIR /app

# Only copy production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend and server
COPY --from=builder /app/dist ./dist
COPY server ./server

# Copy seed data (overridden by volume in production)
COPY data ./data

EXPOSE 3000

CMD ["node", "server/index.js"]
