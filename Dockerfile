FROM nginx:alpine

WORKDIR /tmp/app
ADD . ./

RUN sh ./build.sh
