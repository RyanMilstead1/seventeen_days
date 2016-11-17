(function() {

  /*
   * Manage user password reset requests.
   */

  angular.module('seventeendays').controller('ResetRequestCtrl', function($scope, $rootScope, $auth, messageService, FRIENDLY_ERRORS) {
    $scope.creds = {};

    $scope.requestPasswordReset = (creds) => {
      $auth.requestPasswordReset(creds)
        .then(function(resp) {
          messageService.broadcastMessage(FRIENDLY_ERRORS.getMessage('reset.requestSuccess'));
        })
        .catch(function(resp) {
          if (resp.status === 404) {
            try{
              messageService.broadcastError({exception: resp.data.errors[0]});
            } catch(z) {
              messageService.broadcastError(FRIENDLY_ERRORS.getException('reset.cantFindEmail'));
            }
          } else {
            messageService.broadcastError(FRIENDLY_ERRORS.getException('reset.default'));
          }
        });
    };

  });

})();
