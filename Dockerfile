FROM node:8 AS builder
WORKDIR /src
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
RUN npm install -g prpl-server
COPY --from=builder /src/build/ .
COPY . .
EXPOSE 80
CMD [ "prpl-server", "--config" , "polymer.json" ,"--host" ,"0.0.0.0", "--port" ,"80" ]
