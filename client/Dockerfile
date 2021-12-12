FROM node:14-bullseye
ARG GIT_VERSION
ARG GIT_DATE
ARG SERVER_ADDRESS
ENV GIT_VERSION=$GIT_VERSION
ENV GIT_DATE=$GIT_DATE
ENV SERVER_ADDRESS=$SERVER_ADDRESS
LABEL maintainer="Nico Bosshard"
LABEL version=$GIT_VERSION
LABEL description="Praktische sichere Multi-Party-Computation Client"
EXPOSE 8080/tcp
WORKDIR /root
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y \
    iputils-ping \
    iproute2
COPY . /root
RUN npm install
RUN rm -rf dist && mkdir dist
RUN npx tsc app.ts
RUN npx webpack
RUN rm -f app.js
CMD npx http-server --ext xhtml -d false --log-ip true -p 8080
