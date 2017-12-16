#!/bin/bash
set -euxo pipefail

# Install programs required for build
npm install -g yarn bower polymer-cli

# Fetch dependencies
yarn
bower --allow-root install

# Compress images and build
yarn run build optimize-images
yarn run build
