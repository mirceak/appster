FROM node:10

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm update

EXPOSE 80

CMD ["node", "index"]