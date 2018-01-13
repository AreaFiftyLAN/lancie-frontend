FROM node:8 AS builder
WORKDIR /src
ADD . ./
RUN docker/dockerbuild.sh

FROM node:8-alpine
RUN npm install -g prpl-server
COPY --from=builder /src/build/ .
COPY . .
EXPOSE 80
CMD [ "prpl-server", "--config" , "polymer.json" ,"--host" ,"0.0.0.0", "--port" ,"80" ]
