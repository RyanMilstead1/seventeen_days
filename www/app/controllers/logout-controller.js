(function() {

  /*
   * Manage user logout.
   */

  angular.module('seventeendays').controller('LogoutCtrl', function($state, $auth, userSessionService) {
    return userSessionService.unload().then(()=>{
      return $auth.signOut();
    });
  });

})();
