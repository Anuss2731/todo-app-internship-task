
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner

WORKDIR /app


RUN addgroup -S nodegrp && adduser -S nodeusr -G nodegrp


COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY server.js ./
COPY public ./public

USER nodeusr

EXPOSE 3000

CMD ["node", "server.js"]