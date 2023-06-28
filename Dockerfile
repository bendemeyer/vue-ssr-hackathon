FROM node:20
LABEL authors="hackday!!"
COPY . ./
EXPOSE 3000
RUN npm i
RUN npm run build
CMD npm run start
