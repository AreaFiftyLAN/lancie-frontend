#!/bin/bash
set -euxo pipefail

# Install programs required for build
npm install -g bower
npm install -g polymer-cli --unsafe-perm

# Fetch dependencies
yarn
bower --allow-root install

# Compress images and build
yarn run optimize-images
yarn run build
