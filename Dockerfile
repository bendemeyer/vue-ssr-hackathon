FROM node:20
LABEL authors="hackday"

EXPOSE 3000

# copy just package.json so npm i step can be cached if package.json doesn't change
COPY package.json ./
RUN npm i

# now copy everything else and run the buidl
COPY . ./
RUN npm run build

CMD npm run start
