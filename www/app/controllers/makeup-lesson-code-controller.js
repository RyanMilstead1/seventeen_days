(function() {

  /*
   * Provides user option to enter lesson access code.
   */

  angular.module('seventeendays').controller('MakeupLessonCodeCtrl',
    function($scope, $state, $http, $ionicPopup, userSessionService, URLService, localStorageService, surveyService) {
    let currentUser = userSessionService.getCurrentUser();
    $scope.lesson = 'makeuplesson';
    $scope.makeupBackground = 'makeup_lesson_menu.png';

    // This checks to see if student is in the 'Seventeen Days' or 'Eat Smart' lesson curriculum
    if (currentUser.app_type && currentUser.app_type === "eat_smart") {
      $scope.lesson = 'makeupeslesson';
      $scope.makeupBackground = 'es_makeup_lesson_menu.png';
    }

    $scope.startMakeupLesson = (lessonNum) => {
      localStorageService.set('Lesson', $scope.lesson + lessonNum);
      $state.go('app.makeup-lesson', { key: $scope.lesson + lessonNum});
    };

  });

})();
