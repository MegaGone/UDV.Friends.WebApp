FROM node:20-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install -g pnpm
RUN pnpm install

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV=production

CMD [ "node", "dist/main.js" ]