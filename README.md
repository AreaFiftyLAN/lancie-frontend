# LANcie frontend
Welcome to the pretty part of the Area FiftyLAN system! This repo contains all the code that you will see served at https://areafiftylan.nl, including the ticketsale, my-area and seatmap. The front-end is built with [Polymer](https://www.polymer-project.org/1.0/), Google's Web Components framework. There are a couple of things you need to do before you can enjoy all that lovely material design goodness.

The application works without a back-end, but to enjoy the full functionality, you need to have the back-end running aswell. You can find our back-end also on GitHub, the [LANcie-API](https://github.com/AreaFiftyLAN/lancie-api).

## lancie-frontend
Handles front end user interaction, couples with lancie-api. Built with Polymer, all the polymer documentation about the internal functions can be found [here](https://www.polymer-project.org/1.0/docs/about_10). It would be helpful to glance over the internal polymer functions, this will avoid small mistakes and issues early on. All documentation about the Polymer elements is located [here](https://elements.polymer-project.org).

### Tools & Dependencies
These are the tools you need to install manually, the rest of the needed tools follow from this.
-   [node](https://nodejs.org/en/) which is the Javascript runtime environment that is used by the other tools. If you have installed this, you need to run three commands to finalize the installation. These commands require you to globally install some tools, during installation an error could occur regarding permissions. If you are required to call the commands with superuser priviliges you are doing something wrong!
-   [yarn](https://yarnpkg.com/en/docs/install) is the package manager we use to fetch all javascript dependencies.
-   `yarn global add bower`
-   `yarn`
-   `bower install`

### Viewing locally
To view the webpage locally, run `yarn run serve`. The page will be shown on `https://localhost:5100`

### Build
To build the entire frontend, the `yarn run build` command is used. This command relies on the `polymer-cli` package with v1.5.7 or higher. The build process places the complete and ready to serve webpage in `./build`. There are two folders located in the build folder, a es5-bundled and an es6-unbundled version. The bundled version is for non-http/2 compatible servers. The unbundled version is for http/2 compatible servers. Keep in mind that if images are added since the last build, these have to be compressed, this is done with `yarn run build optimize-images`.

You can serve the build with `polymer serve build/fallback` or `polymer serve build/modern`.

### Deploy
To deploy the frontend, you can upload it to a server. This can be done by copying and pasting manually, but this is quite cumbersome. The easiest way to do this is with the `scp` command (only available on linux and OS X, no download needed). The scp command works like this:

```
scp -r $(local_build_folder)/. $(server_login)@$(server_ip):$(server_destination_folder)
```

Upon running this command, you are prompted to enter your password and all the files in the `$(build_folder)` are getting transferred to the `$(destination_folder)` on the target server. Authentication on the server is provided by the `$(server_login)` portion, this is your username on the server.

## TL:DR;
```
git clone git@github.com:AreaFiftyLAN/lancie-frontend.git
cd lancie-frontend
yarn
bower install
yarn run serve
```
