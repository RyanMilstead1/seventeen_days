(function() {

  /*
   * Provides access to the survey data and display.
   */

  angular.module('seventeendays').service('surveyService',
    function($state, $auth, $rootScope, $ionicModal, localStorageService, $http, $timeout, URLService, $q, DATA){

    var self = this;
    var $scope = $rootScope.$new();
    $scope.responses = {};
    $scope.buttonText = "Submit";
    $scope.buttonType = "button-positive";

    this.checkSurveyPositions = (position) => {
      angular.forEach($rootScope.surveys, function(survey) {
        if (survey.position === position) {
          displaySurveyModal(survey);
        }
      })
    }

    this.setActiveSurveys = (user) => {
      angular.forEach(user.surveys, function(survey) {
        if (~user.active_survey_ids.indexOf(survey.id) && !~$rootScope.surveys.indexOf(survey)) {
          $rootScope.surveys.push(survey);
        }
      });
    }

    const checkResponses = (responses) => {
      let check = true;
      angular.forEach(responses, function(value, key) {
        if (value.answer_id === null) {
          check = false;
        }
      })
      if (!check) {setErrorButton();};
      return check;
    }

    $scope.submitSurveyResponses = (responses) => {
      if (checkResponses(responses)) {
        let data = {responses: responses}
        var defer = $q.defer();
        $http({
          method: 'POST',
          url: `${URLService.getResponseURL()}`,
          data :  data
        }).then((data)=>{
          defer.resolve();
        },(error)=>{
          defer.reject(error.data);
        })
        setSuccessButton();
        return defer.promise;
      }
    }

    const displaySurveyModal = (survey) => {
      $scope.data = {}
      $scope.survey = survey;
      setResponsesObject(survey);
      $ionicModal.fromTemplateUrl('views/survey.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
        return modal;
      })
    }

    const setResponsesObject = (survey) => {
      let currentUser = $rootScope.getCurrentUser();
      for (var i=0; survey.questions.length > i; i++) {
        var response = {user_id: currentUser.id, survey_id: survey.id, answer_id: null};
        $scope.responses[survey.questions[i].id] = response;
      }
    }

    const setErrorButton = () => {
      $scope.buttonText = "Please answer all questions...";
      $scope.buttonType = "button-assertive";
    }

    const setSuccessButton = () => {
      $scope.buttonText = "Thanks!"
      $scope.buttonType = "button-balanced"
      $timeout(function() {
      }, 3000).then(function() {
        $scope.modal.hide();
      })
    }

  });

})();
