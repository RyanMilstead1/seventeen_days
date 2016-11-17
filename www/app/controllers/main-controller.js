(function() {

  /*
   * Manages interactions with menu.
   */

  angular.module('seventeendays').controller('MainCtrl', function($scope, $state, $auth, $rootScope, localStorageService, userSessionService, ENDPOINTS) {
    $scope.register = () => $state.go('app.register');
    $scope.goBack = () => $state.go('app.access');
    $scope.login = () => $state.go('app.login');
    $scope.logout = () => $state.go('app.logout');
    $scope.preview = () => $state.go('app.preview');
    $scope.resumeVideo = () =>{
      var sesh = userSessionService.getCurrentState();
      $rootScope.resume = true;
      $state.go(sesh.state, sesh.params);
    }
  });

})();
