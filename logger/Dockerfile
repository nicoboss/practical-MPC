FROM node:14-bullseye
ARG GIT_VERSION
ARG GIT_DATE
ENV GIT_VERSION=$GIT_VERSION
ENV GIT_DATE=$GIT_DATE
LABEL maintainer="Nico Bosshard"
LABEL version=$GIT_VERSION
LABEL description="Praktische sichere Multi-Party-Computation Logger"
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
CMD npx http-server
