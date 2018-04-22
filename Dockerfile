FROM node:8 AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
RUN npm install -g bower
RUN npm install -g polymer-cli --unsafe-perm
COPY bower.json ./
RUN bower --allow-root install
COPY images/ images/
COPY src/ src/
COPY scripts/ scripts/
COPY data/ data/
COPY gulp/ gulp/
COPY index.html ce-fix.html favicon.ico gulpfile.js manifest.json polymer.json robots.txt .jshintrc ./
RUN yarn run build

FROM node:8-alpine

ARG user=lancie
ARG group=lancie
ARG uid=1010
ARG gid=1010

RUN addgroup -g ${gid} ${group} \
  && adduser -D -u ${uid} -G ${group} ${user}

RUN npm install -g prpl-server

USER ${uid}
WORKDIR /home/${user}/app
COPY --from=builder /app/build/ ./

EXPOSE 8080
CMD [ "prpl-server", "--config" , "polymer.json" ,"--host" ,"0.0.0.0", "--port" ,"8080" ]
