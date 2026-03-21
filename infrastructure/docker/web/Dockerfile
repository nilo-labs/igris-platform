FROM node:20-slim

ENV CI=true

RUN apt-get update && apt-get install -y openssl && npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

EXPOSE 5173

CMD ["pnpm", "--filter", "web", "run", "dev"]