## Build application
FROM node:14-alpine as builder
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build

## Setup production application
FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
RUN npm ci --only=production --production

## Exposer ports and run
EXPOSE 3000
CMD ["node", "dist/main.js"]