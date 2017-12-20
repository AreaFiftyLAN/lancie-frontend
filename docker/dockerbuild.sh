#!/bin/bash
set -euxo pipefail

# Install programs required for build
npm install -g bower
npm install -g polymer-cli --unsafe-perm

# Fetch dependencies
yarn
bower --allow-root install

yarn build
