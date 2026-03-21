FROM node:20-slim

ENV CI=true 

RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install


CMD ["pnpm", "--filter", "agent", "run", "dev"]