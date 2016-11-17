(function() {

  /*
   * Tracks the progress of the user throughout the
   * application workflows.
   */

  angular.module('seventeendays').service('TrackingService', function($rootScope, $state, $http, $timeout, $ionicPopup, userSessionService, DataService, URLService, localStorageService, surveyService) {

    function lessonCompletePopup() {
      var alertPopup = $ionicPopup.alert({
        title: 'Lesson Complete',
        template: "You have finished your lesson. Please click 'OK' to return to the lesson selection page."
      });

      alertPopup.then(function() {
        $state.go('app.lesson-code');
        surveyService.checkSurveyPositions(3);
      })
    };

    /*
     * Track a path selection.
     */
    function trackPath(path) {
      let currentUser = userSessionService.getCurrentUser();
      let data = {
        thisaction: path.action,
        marker: path.marker,
        user: currentUser.email
      };

      postViewLogData(data);
    }

    /*
     * Track user's progression to a step.
     */
    function trackStep(step) {
      let currentUser = userSessionService.getCurrentUser();
      let data = {
        thisaction: 'increment',
        user: currentUser.email
      };

      const stepData = DataService.getStepData(step);
      data = Object.assign({}, data, stepData);
      postViewLogData(data);
    }

    function trackVideoProgress(fileName, time, key) {
      let videoData = {current_file: fileName, current_file_time: time, current_key: key};
      userSessionService.updateVideoProgress(videoData);
    }

    function postViewLogData(data) {
      if(data.marker) {
        $http({
          method: 'POST',
          url: URLService.getViewLogsURL(),
          data
        });
      }
    }

    function countdown(time) {
      var timeLeft = time;
      $rootScope.timer = $timeout(function() {
        timeLeft--;
        if(timeLeft <= 0 && $rootScope.videoComplete) {
          stopCountdown();
          lessonCompletePopup();
        } else {
          countdown(timeLeft);
        }
      }, 1000);
    }

    function stopCountdown() {
      $timeout.cancel($rootScope.timer);
    }

    return {
      trackPath: trackPath,
      trackStep: trackStep,
      countdown: countdown,
      lessonCompletePopup: lessonCompletePopup,
      trackVideoProgress: trackVideoProgress
    };
  });
})();
