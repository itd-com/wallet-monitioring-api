FROM node:16.20-alpine as build

WORKDIR /app

COPY . .

RUN npm install -g yarn --force

RUN rm -rf node_modules

RUN yarn install --force

RUN yarn build

RUN rm -rf node_modules

RUN yarn cache clean

RUN yarn install --production


FROM node:16.20-alpine as main
WORKDIR /app
COPY --from=build /app .

ENV HOST 0.0.0.0
ARG SERVER_ENV
ENV SERVER_ENV ${SERVER_ENV}
CMD npm run start