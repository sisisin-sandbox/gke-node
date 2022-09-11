FROM node:16-slim

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --only=production

COPY . ./

CMD [ "yarn", "start" ]
