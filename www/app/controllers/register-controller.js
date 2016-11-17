(function() {

  /*
   * Manage registration interactions.
   */

  angular.module('seventeendays').controller('RegisterCtrl', function($scope, $state, $rootScope, $timeout, FRIENDLY_ERRORS, messageService, $auth) {


    $scope.user = { activationCode: $state.params.activationCode};

    var emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

    $scope.verifyPassword = (userDataObj) => {
        $scope.identical = userDataObj.new_password === userDataObj.verify_password;
    };

    $scope.register = (user) => {
      console.log('register called');
      if (!user || !user.email || !user.new_password) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('login.emailPasswordRequired'));
        return;
      }
      if (!emailRegex.test(user.email)) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('login.emailIsInvalid'));
        return;
      }
      if ($scope.identical != true) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('register.passwordsNoMatch'));
        return;
      }
      if (user.new_password.length < 8) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('register.passwordTooShort'));
        return;
      }

      var credentials = { email: user.email, password: user.new_password, password_confirmation: user.verify_password, activationCode: user.activationCode };

      return $auth.submitRegistration(credentials)
        .then((user)=>{
          messageService.broadcastMessage(FRIENDLY_ERRORS.getMessage('register.thanks'));
          $timeout(function() {
          }, 5000).then(function() {
            $state.go('app.login');
          })
        }, (error) =>{
            if (error.status === 422) {
              messageService.broadcastError(FRIENDLY_ERRORS.getException('register.emailAlreadyTaken'));
            } else {
              messageService.broadcastError(FRIENDLY_ERRORS.getException('register.default'));
            }
        });

    };
  });

})();
