#Seventeen Days
=============
Seventeen Days Interactive is a theory-based interactive film created by Carnegie Mellon University designed to educate young women about contraception and sexually transmitted infections (STIs). The film experience is interactive, allowing viewers to choose what they want to watch and tracks potential viewers progress through the app for analytics and usage. The application was built as a hybrid web/mobile application utilizing Ionic/Angular for the frontend and RoR api backend 

#### Install Ionic

First, install Node.js. Then, install the latest Cordova and Ionic command-line tools. Follow the Android and iOS platform guides to install required platform dependencies.

_Note: iOS development requires Mac OS X. iOS simulator through the Ionic CLI requires the ios-sim npm package, which can be installed with the command sudo npm -g install ios-sim._

`$ npm install -g cordova ionic`

Windows users: We strongly recommend Visual Studio Community for development which comes with everything you need (including templates!)

Here are a few commands that are useful with ionic:
```
$ ionic serve
// starts the local dev environment and opens a page in your default browser

$ ionic platform add ios (android)
// adds the respective platform to the project

$ ionic build ios (android)
// build the codebase into app form for the respective platform

$ ionic emulate ios (android)
// emulates the app on any local emulators or connected devices
```

#### Install gulp globally:

If you have previously installed a version of gulp globally, please run `npm rm --global gulp` to make sure your old version doesn't collide with gulp-cli.

`$ npm install --global gulp-cli`

In order to register changes made in local development you should run this command along with `ionic serve`:

`gulp watch`

#### Local Dev Tips:
In the index.html file, be sure to comment out this line during local development and that will clear up a lot of console errors about content security policies

`<meta http-equiv="Content-Security-Policy" content="default-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'">`

CSS changes should be made in `scss/ionic.app.scss`

Most of the app flow can be found in `www/app/constants/data-constant.js` and `www/app/services/workflow-service.js`

### Notes:

- Notebook menu image (notebook_menu.jpg) is missing "Go Back" button.
- Data/content is missing for "What's the risk?" path (from stimain).
