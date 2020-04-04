FROM node:10

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/node_modules
RUN mkdir -p /usr/src/app/app/node_modules
RUN mkdir -p /usr/src/app/app/dist

WORKDIR /usr/src/app

COPY . .

RUN npm install && cd app && npm install && npm run build

EXPOSE 80

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && node index