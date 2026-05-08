FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV DJANGO_INTERNAL_URL=http://api:8000
ENV NEXT_PUBLIC_API_BASE_URL=/api/v1/
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/.next ./.next
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/package.json ./package.json
USER node
EXPOSE 3000
CMD ["npm", "start"]
