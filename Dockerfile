FROM node:18-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* ./
COPY src ./src
COPY public ./public
COPY next.config.js .
COPY tsconfig.json .
COPY .env .env.production

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]