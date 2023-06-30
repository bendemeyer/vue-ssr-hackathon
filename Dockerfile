FROM node:20 AS base

WORKDIR /app
EXPOSE 3000

# copy just package.json so npm i step can be cached if package.json doesn't change
COPY package.json ./
RUN npm i
COPY . ./

FROM base as dev

WORKDIR /app

CMD npm run dev

FROM base as builder

# now copy everything else and run the build
RUN npm run build

ENV FOO=default-from-dockerfile

FROM builder

ENV NODE_ENV=production

RUN npm install

CMD npm run start
