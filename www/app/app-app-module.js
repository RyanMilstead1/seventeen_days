(function() {

/*
 * Seventeen Days
 */


  const appDependencies = [
    'ionic',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ngRoute',
    'ngCookies',
    'LocalStorageModule',
    'ui.router.compat',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.buffering',
    'ng-token-auth'
  ];

  angular.module('seventeendays', appDependencies)
    .config((localStorageServiceProvider) => {
      localStorageServiceProvider.prefix = 'seventeendays';
    })



})();
