FROM golang:1.17-bullseye
ARG GIT_VERSION
ARG GIT_DATE
ENV GIT_VERSION=$GIT_VERSION
ENV GIT_DATE=$GIT_DATE
LABEL maintainer="Nico Bosshard"
LABEL version=$GIT_VERSION
LABEL description="Praktische sichere Multi-Party-Computation Server"
EXPOSE 8080/tcp
WORKDIR /root
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y \
    iputils-ping \
    iproute2
COPY . /root
RUN go build .
CMD /bin/bash --init-file ./run.sh
