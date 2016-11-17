(function(){

  angular.module('seventeendays')
    .config(function($authProvider, ENDPOINTS) {
      $authProvider.configure({
          apiUrl: ENDPOINTS.API,
          storage: 'localStorage',
          omniauthWindowType: window.cordova == undefined ? 'sameWindow' : 'inAppBrowser',
          authProviderPaths: {
            twitter:   '/auth/twitter',
            facebook:  '/auth/facebook',
            instagram: '/auth/instagram'
          },
          passwordResetSuccessUrl: (window.location.origin + '/#/app/password-reset')
      });
    });

})()
