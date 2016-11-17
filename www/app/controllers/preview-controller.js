(function() {

  /*
   * Manages app preview.
   */

  angular.module('seventeendays').controller('PreviewCtrl', function($scope, $rootScope, $sce, $ionicPopup, WorkflowService, localStorageService, userSessionService, $state) {
    let vm = this;
    vm.onPlayerReady = WorkflowService.setVideoAPI;
    vm.videoSources = [{src: $sce.trustAsResourceUrl("https://s3-us-west-2.amazonaws.com/seventeendays/Open/open1.mp4"), type: "video/mp4"}]
    vm.onCompleteVideo = () => {
      $ionicPopup.alert({
        title: 'Preview Complete',
        template: "You have finished your preview. Please click 'OK' to return to the main page."
      })
      .then(function() {
        $state.go('app.access');
      });
    }
  });

})();
