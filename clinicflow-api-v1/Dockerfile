# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock* ./
COPY prisma ./prisma/

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma:generate
RUN yarn build

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000

# Automatically push database schema & seed initial admin on launch
CMD ["sh", "-c", "yarn prisma db push && yarn prisma:seed && node dist/index.js"]
