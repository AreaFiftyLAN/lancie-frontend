# Area FiftyLAN Website
Welcome to the pretty part of the Area FiftyLAN system! This repo contains all the code that you will see served at https://areafiftylan.nl, including the ticketsale, my-area and soon the seatmap.

The front-end is built with [Polymer](https://www.polymer-project.org/1.0/), Google's Web Components framework. There are a couple of things you need to do before you can enjoy all that lovely material design goodness.
## Getting started
Getting our website to run locally on your own machine is easy. Just follow these steps and all should be good to go in a few minutes.
First of all, clone this repo!

```git clone git@github.com:AreaFiftyLAN/lancie-frontend.git```

After that, make sure you got everything you need to install the dependencies (dependencies of the dependency management?). Which is Node.js. Just grab the latest version from https://nodejs.org/en/

We need node for its package manager `npm`. Therefore, make sure you can run `npm` from the command line. Once you can, open a command prompt/terminal in the folder where you just cloned this repo.

You may need administrator rights to install the following:
```
npm install -g bower
```

We need these two packages to install all the other dependencies. The `-g` means we can run both `gulp` and `bower` from any directory on the command line. Useful for other projects you might encounter, as they're both commonly used tools.

On to the more serious business. Run the following commands to install Polymer and all the other things we use for the website

```
npm install
bower install
```

This might take a while, but that's it!

To inspect the local dev website:
```
npm run serve
```
(Sort of) builds the entire app and starts a local webserver. Your browser should open on https://localhost:5100 and display the full site! If not, something went wrong.

You can generate a production ready build by simply running `npm run build`. This builds the entire app and puts it in the `build` folder. That folder contains everything you need, so that's what we upload to our webserver. You can use the gulp webserver by running `npm run serve-build`

Easy enough huh?

There's one more catch. While the homepage can do fine without someone to talk to, the more complex functionality like buying tickets and My Area require a back-end. See [the LANcie API](https://github.com/AreaFiftyLAN/lancie-api) for details on how to run that. We expect it to run at port 9000!

## TL:DR

```
git clone git@github.com:AreaFiftyLAN/lancie-frontend.git
cd lancie-frontend
npm install
bower install
gulp serve
```
