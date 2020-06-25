###### Build project ######
FROM node:12-alpine AS builder

# Copy image data
WORKDIR /usr/src/app
COPY package.json .
COPY . .
RUN npm install
RUN npm run build

###### Deploy project ######
FROM node:12-alpine

# Copy dependency definitions
WORKDIR /usr/src/app
COPY package.json .
COPY --from=builder /usr/src/app/dist ./dist
RUN npm install

VOLUME ["uploads/images/original"]
VOLUME ["uploads/images/thumbs"]

EXPOSE 3000
CMD ["node", "dist/main.js"]