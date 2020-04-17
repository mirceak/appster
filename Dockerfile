FROM node:10

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

EXPOSE 80

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait