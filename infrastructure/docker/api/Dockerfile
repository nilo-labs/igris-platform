FROM node:20-slim

ENV CI=true

RUN apt-get update && apt-get install -y openssl && npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

EXPOSE 3333

CMD sh -c "pnpm --filter @igris/database run db:push && pnpm --filter api run dev"