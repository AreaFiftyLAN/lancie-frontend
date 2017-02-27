FROM nginx:alpine

WORKDIR /tmp/app
ADD . ./

COPY nginx_server.conf /etc/nginx/conf.d/default.conf

RUN sh ./build.sh
