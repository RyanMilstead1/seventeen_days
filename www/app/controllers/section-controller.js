(function() {

  /*
   * Manages the workflow within a chosen section.
   */

  angular.module('seventeendays').controller('SectionCtrl', function($scope, $rootScope, $stateParams, $state, WorkflowService, surveyService, TrackingService, userSessionService) {

    let vm = this;
    let currentUser = userSessionService.getCurrentUser();
    WorkflowService.chooseSection($stateParams.key, vm);
    // We need to do a few things when the app reaches Jessica's Room
    if ($stateParams.key === 'jessica') {
      surveyService.checkSurveyPositions(3);
    }


    vm.onPlayerReady = WorkflowService.setVideoAPI;
    if ($rootScope.resume) {
      vm.positionInTime = WorkflowService.choosePath(currentUser.current_key);
    } else {
      vm.positionInTime = WorkflowService.choosePath('opening');
    }

    $scope.currentCheck = 0;
    vm.onUpdateTime = function(currentTime, totalTime) {
      let roundedTime = Math.floor(currentTime);
      if(roundedTime % 5 === 0 && $scope.currentCheck !== roundedTime) {
        $scope.currentCheck = roundedTime;
        TrackingService.trackVideoProgress($rootScope.currentVideoFile, roundedTime, $rootScope.currentKey);
      }
    }

    // Get selection from user and move timeline.
    vm.moveTimeline = (selected) => {
      if (selected) {
        vm.positionInTime = WorkflowService.choosePath(selected);
      } else {
        vm.positionInTime = WorkflowService.advance();
      }
    }

    vm.selectSection = key => $state.go('app.section', { key: key });
    vm.onCompleteVideo = () => vm.positionInTime = WorkflowService.advance();
  });

})();
