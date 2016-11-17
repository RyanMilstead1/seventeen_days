(function() {

  /*
   * Provides access to app message/error functions.
   */

  angular.module('seventeendays').factory('messageService', ($rootScope, $ionicPopup) => {
    /*
     * Broadcast an information message.
     */
     function broadcastMessage(message) {
       $rootScope.$broadcast('info', message);
     }

    /*
     * Broadcast an error message.
     */
    function broadcastError(error) {
      $rootScope.$broadcast('error', error);
    }

    function loginPopup() {
      $ionicPopup.alert({
        title: 'Uh-Oh',
        template: "You have to login in before you do that!",
        okType: 'button-assertive'
      });
    }

    return {
      broadcastMessage,
      broadcastError,
      loginPopup
    };
  });

})();
