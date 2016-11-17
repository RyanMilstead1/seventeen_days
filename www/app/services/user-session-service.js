(function() {

  /*
   * Provides access to the application data.
   */

  angular.module('seventeendays').service('userSessionService',
    function($state, $auth, $rootScope, localStorageService, $http, URLService, surveyService, $q, DATA){

    var self = this;
    this.getCurrentUser = () => {
      return $rootScope.getCurrentUser();
    }

    this.refreshUser = () =>{
      var defer = $q.defer();
      $http.get(URLService.getUserUrl(self.getCurrentUser().id))
        .then(function(resp){
          $rootScope.user = resp.data;
          return defer.resolve(self.getCurrentUser());
        });
      return defer.promise;
    }

    this.registerActivationCode = (activationCode) => {
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: `${URLService.getActivationCodeURL()}`,
        data : { code: activationCode, user_id: self.getCurrentUser().id }
      }).then((response)=>{
        defer.resolve(response.data);
      },(error)=>{
        defer.reject(error.data);
      })
      return defer.promise;
    }

    this.getCurrentState = () => {
      const appPosition = self.getPosition();
      if(appPosition) {
        const sectionKeys = Object.keys(DATA.paths);
        for(let i = 0, l = sectionKeys.length; i < l; i++) {
          if(~appPosition.indexOf(sectionKeys[i])) {
            if (~appPosition.indexOf('makeup')) {
              return { state: 'app.makeup-lesson', params: { key: appPosition }}
            } else if (~appPosition.indexOf('lesson')) {
              return { state: 'app.lesson', params: { key: appPosition }}
            } else {
              return { state: 'app.section', params: { key: sectionKeys[i] }}
            }
          }
        }
      }
      return { state: 'app.section', params: { key: 'open' }};
    }

    this.updatePosition = (position) => {
      let updateObj = {position: position};
      if (position === 'jessica' && !$rootScope.user.jessicas_room) {
        updateObj.jessicas_room = true;
      }
      $auth.updateAccount(updateObj)
        .then(function(resp) {
          $rootScope.user = resp.data.data;
        })
        .catch(function(resp) {
          console.log("ERROR: User position could not be updated.");
        });
    }

    this.getPosition = () => {
      if ($rootScope.hasCurrentUser()) {
        return $rootScope.user.position;
      }
    }

    this.updateVideoProgress = (data) => {
      if (data.current_file && data.current_file_time && data.current_key) {
        $auth.updateAccount(data)
          .then(function(resp) {
            $rootScope.user = resp.data.data;
          })
          .catch(function(resp) {
            console.log("ERROR: User video progress could not be updated.");
          });
      }
    }

    /*
     * Sign a user in.
     */
    this.load = function(user) {
      self.repairPostionErrors(user);
      $rootScope.user = user;
      surveyService.setActiveSurveys(user);
      surveyService.checkSurveyPositions(1);
      if (user.current_key) {$rootScope.currentKey = user.current_key}
      if (self.userHasLicense(user)) {
        if ($rootScope.inLessons()) {
          return $state.go('app.lesson-code');
        } else {
          let userSesh = self.getCurrentState( );
          return $state.go(userSesh.state, userSesh.params)
        }
      } else {
        return $state.go('app.section', {key: 'openpreview'});
      }
    }

    this.repairPostionErrors = (user) => {
        if (user.app_type === 'seventeen_days' && user.position)  {
          if (user.position.indexOf('lesson') > -1) {user.position = 'open';}
        }
    }

    // This will check if the user logging in has a valid license
    // Set this to return false if you want to test the preview mode
    this.userHasLicense = (user) => {
      let result = false;
      if (user.activation_codes.length > 0) {
        for (var i=0; i < user.activation_codes.length; i++) {
          if (!user.activation_codes[i].expired) {
            result = true;
            break;
          }
        }
      }
      return result;
    }


    /*
     * Sign a user out.
     */
    this.unload = function() {
      localStorageService.remove('Lesson');
      localStorageService.remove('auth_headers')
      $rootScope.surveys = [];
      $rootScope.videoComplete = true;
      delete $rootScope.user;
      return $state.go('app.access');
    }

  });

})();
