ARG NODE_VERSION='20.3.1'
ARG CYPRESS_VERSION='12.16.0'

FROM cypress/factory:2.3.0

COPY package.json ./
RUN npm install

COPY . ./

ENTRYPOINT ["cypress"]
