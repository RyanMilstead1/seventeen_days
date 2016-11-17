(function() {

  /*
   * Manages navigation display.
   */

  angular.module('seventeendays').controller('NavigationCtrl', function($scope, $rootScope, localStorageService, userSessionService, $state) {
    $scope.hasJessicaRoom = localStorageService.get('jessica_room');
    $scope.$on('jessicaRoom', event => $scope.hasJessicaRoom = true);    
  });

})();
