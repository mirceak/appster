FROM node:10

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install && cd app && npm install && npm run build

EXPOSE 80

CMD ["node", "index"]