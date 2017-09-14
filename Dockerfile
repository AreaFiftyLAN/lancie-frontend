FROM node:8 AS builder
WORKDIR /src
ADD . ./
RUN docker/dockerbuild.sh

FROM nginx:mainline
COPY docker/nginx_server.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /src/build /srv/www