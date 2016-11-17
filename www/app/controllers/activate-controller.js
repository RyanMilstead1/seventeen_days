(function() {

  /*
   * Manage user activation code entry.
   */

  angular.module('seventeendays').controller('ActivateCtrl',
    ($scope, $q, $http, $rootScope, URLService, userSessionService, $state)=>{

    let userSessionState = userSessionService.getCurrentState();

    $scope._user = userSessionService.getCurrentUser();

    $scope.register = (activationCode) => {
      return userSessionService.registerActivationCode(activationCode)
        .catch((failure)=>{
          $scope.activationCodeInvalid = failure.exception;
        })
        .then(()=>{
          return userSessionService.refreshUser();
        })
        .then((user)=>{
          $scope._user = user;
          var userSesh = userSessionService.getCurrentState();
          if (!$scope.activationCodeInvalid && userSessionService.userHasLicense(user)) {
            if ($rootScope.inLessons()) {
              return $state.go('app.lesson-code');
            } else {
              return $state.go('app.section', {key: 'open'});
            }
          }
        });
    }

    $scope.clearError = () => {
      delete $scope.activationCodeInvalid;
    }

  });

})();
