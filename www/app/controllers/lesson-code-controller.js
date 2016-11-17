(function() {

  /*
   * Provides user option to enter lesson access code.
   */

  angular.module('seventeendays').controller('LessonCodeCtrl',
    function($scope, $state, $http, $ionicPopup, userSessionService, URLService, localStorageService, surveyService) {
    let currentUser = userSessionService.getCurrentUser();
    $scope.lesson = 'lesson';
    $scope.background = "pr_menu.png";

    // This checks to see if student is in the 'Seventeen Days' or 'Eat Smart' lesson curriculum
    if (currentUser.app_type && currentUser.app_type === "eat_smart") {
      $scope.lesson = 'eslesson';
      $scope.background  = 'eat_smart_pr_menu.png';
    }

    $scope.startLesson = (lessonNum) => {
      localStorageService.set('Lesson', $scope.lesson + lessonNum);
      $state.go('app.lesson', { key: $scope.lesson + lessonNum});
    };

  });

})();
