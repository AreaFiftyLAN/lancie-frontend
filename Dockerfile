FROM node:8 AS builder

RUN useradd -r -m lancie
RUN mkdir /app
RUN chown lancie /app

RUN npm install -g bower
RUN npm install -g polymer-cli --unsafe-perm

USER lancie
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY bower.json ./
RUN bower --allow-root install
COPY images/ images/
COPY src/ src/
COPY scripts/ scripts/
COPY gulp/ gulp/
COPY index.html ce-fix.html favicon.ico gulpfile.js manifest.json polymer.json robots.txt .jshintrc ./
RUN yarn run build

FROM node:8-alpine
RUN npm install -g prpl-server
COPY --from=builder /app/build/ .
EXPOSE 8080
CMD [ "prpl-server", "--config" , "polymer.json" ,"--host" ,"0.0.0.0", "--port" ,"8080" ]
