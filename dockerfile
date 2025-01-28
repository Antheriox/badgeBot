FROM node:20.9-bookworm-slim

WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN chown -R node:node /home/node/app

RUN chmod -R 700 /home/node/app

USER node

CMD ["node", "src/index.js"]