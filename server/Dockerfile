# build with golang 17 and w/o c libs
FROM golang:1.17 as builder

# add sources
WORKDIR /app
COPY . ./

# build settings: compile linux only and disable crosscompiling 
ENV GOOS=linux
ENV CGO_ENABLED=0

# build app
RUN GOOS=linux go mod tidy
RUN go test ./...

# -ldflags '-w -s'
RUN go build -a -installsuffix cgo -o app .

# build smaller container to run app
FROM alpine:3.13
ARG GIT_VERSION
ARG GIT_DATE
ARG SERVER_ADDRESS
ENV GIT_VERSION=$GIT_VERSION
ENV GIT_DATE=$GIT_DATE
ENV SERVER_ADDRESS=$SERVER_ADDRESS
LABEL maintainer="Nico Bosshard"
LABEL version=$GIT_VERSION
LABEL description="Praktische sichere Multi-Party-Computation Server"

# install prequisites
#RUN apk add iputils-p

# install app
COPY --from=builder /app/app /app/app
WORKDIR /app/
EXPOSE 8080/tcp

# setup entrypoint
CMD ["/app/app"]
