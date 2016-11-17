(function() {

  /*
   * Manage application access.
   */

  angular.module('seventeendays').controller('AccessCtrl', function($scope, $state, userSessionService) {
    $scope.login = () => $state.go('app.login');
    $scope.logout = () => $state.go('app.logout');
    $scope.register = () => $state.go('app.register');
  });

})();
