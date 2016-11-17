(function() {

  /*
   * Generates environment-specific endpoint URLs.
   */

  angular.module('seventeendays').factory('URLService', function(ENDPOINTS) {
    function isProduction() {
      return ENDPOINTS.environment === 'production';
    }

    function getViewLogsURL() {
      return ENDPOINTS.API + ENDPOINTS.VIEWER_LOGS;
    }

    function getUserUrl(userId){
      return ENDPOINTS.API + ENDPOINTS.USERS + '/' + userId;
    }

    function getRegisterURL() {
      return ENDPOINTS.API + ENDPOINTS.REGISTRATION;
    }

    function getLoginURL() {
      return ENDPOINTS.API + ENDPOINTS.LOGIN;
    }

    function getLessonURL() {
      return ENDPOINTS.API + ENDPOINTS.LESSON;
    }

    function getActivationCodeURL(){
      return ENDPOINTS.API + ENDPOINTS.ACTIVATION_CODE
    }

    function getQueryActivationCodeURL(by = 'code') {
      return getActivationCodeURL() + `/show?${by}=`;
    }

    function getResponseURL(){
      return ENDPOINTS.API + ENDPOINTS.RESPONSE;
    }

    return {
      isProduction,
      getViewLogsURL,
      getRegisterURL,
      getLoginURL,
      getLessonURL,
      getUserUrl,
      getQueryActivationCodeURL,
      getQueryActivationCodeUrlForField: getQueryActivationCodeURL,
      getActivationCodeURL,
      getResponseURL
    };
  });
})();
