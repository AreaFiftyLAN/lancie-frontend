#!/bin/sh
set -e

# Install programs required for build
apk --no-cache add nodejs-lts git
npm install -g yarn bower

# Fetch dependencies
yarn
bower --allow-root install

# Compress images and build
yarn run build optimize-images
yarn run build
cp -r ./build/. /srv/www

# Uninstall installed build dependencies and remove cache
yarn cache clean
bower --allow-root cache clean
npm cache clean
npm uninstall -g yarn bower
apk del nodejs-lts git

# Delete folded used for build
rm -r /tmp
