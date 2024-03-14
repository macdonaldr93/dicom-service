FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat git python3 make g++
WORKDIR /app

# Install dependencies and re-use if possible
COPY package.json package-lock.lock* ./
RUN npm install --omit=dev

# Build the source code
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . ./

# No build step currently

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

ARG HOST=0.0.0.0
ARG NODE_ENV=production
ARG PORT=8080

ENV NODE_ENV=$NODE_ENV
ENV HOST=$HOST
ENV PORT=$PORT

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Set the correct permission
RUN mkdir db
RUN mkdir tmp
RUN chown nodejs:nodejs db tmp node_modules src

USER nodejs

EXPOSE $PORT

CMD ["node", "src/index.js"]
