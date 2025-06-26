FROM node:lts-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY --from=builder ./app/dist ./dist
EXPOSE 8081
CMD ["npm","run","start:prod"]
