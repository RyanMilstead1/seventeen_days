(function() {

  /*
   * Manage user login.
   */

  angular.module('seventeendays').controller('LoginCtrl', function($scope, $state, $rootScope, localStorageService, surveyService, messageService, FRIENDLY_ERRORS, $auth, $ionicLoading, authService) {

    var emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

    $scope.creds = {};


    $scope.loginTo = (provider) => {

      $ionicLoading.show({ template: 'please wait...' });

      if (provider === 'default' && userInputIsBad()){
        $ionicLoading.hide();
        return;
      }

      return loginMethod(provider)
        .then((user)=>{
          //handled in raised event
        }, (error)=>{
          if (error.reason && error.reason === "unauthorized") {
            messageService.broadcastError(FRIENDLY_ERRORS.getException('login.unauthorized'));
          } else {
            messageService.broadcastError(FRIENDLY_ERRORS.getException('login.default'));
          }
        })
        .then(()=>{
          $ionicLoading.hide();
        })
    }

    var userInputIsBad = () => {

      if (!$scope.creds.email || !$scope.creds.password) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('login.emailPasswordRequired'));
        return true;
      }

      if (!emailRegex.test($scope.creds.email)) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('login.emailIsInvalid'));
        return true;
      }

      return false;
    }

    var loginMethod = (provider) => {
      if (provider === 'default'){
        return $auth.submitLogin($scope.creds)
      }
      // if (ionic.Platform.isWebView()) {
      //   return authService.login(provider);
      // } else {
      //   return $auth.authenticate(provider);
      // }
      return $auth.authenticate(provider);
    }

  });

})();
