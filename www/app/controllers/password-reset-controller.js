(function() {

  /*
   * Manage user password reset.
   */

  angular.module('seventeendays').controller('PasswordResetCtrl', function($scope, $rootScope, messageService, FRIENDLY_ERRORS, $auth, userSessionService, $timeout) {
    $scope.creds = {};

    $scope.verifyPassword = (userDataObj) => {
        $scope.identical = userDataObj.password === userDataObj.password_confirmation;
    };

    $scope.resetPassword = (creds) => {
      if ($scope.identical != true) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('register.passwordsNoMatch'));
        return;
      }
      if (creds.password.length < 8) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('register.passwordTooShort'));
        return;
      }
      $auth.updatePassword(creds)
        .then(function(resp) {
          // handle success response
          messageService.broadcastMessage(FRIENDLY_ERRORS.getMessage('reset.success'));
          $timeout(function () {
            userSessionService.load(resp.data.data);
          }, 3000)
        })
        .catch(function(resp) {
          console.log("ERROR: ", resp)
          messageService.broadcastError(FRIENDLY_ERRORS.getException('reset.default'));
          // handle error response
        });
    };

  });

})();
