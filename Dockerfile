FROM nginx:alpine

WORKDIR /tmp/app
ADD . ./

COPY ./docker/nginx_server.conf /etc/nginx/conf.d/default.conf

RUN sh ./docker/dockerbuild.sh
