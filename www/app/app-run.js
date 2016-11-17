(function(){

  angular.module('seventeendays')
    .run(function($rootScope, $state, messageService, $auth, $http, $ionicLoading, userSessionService) {

      const logout = (ev) => {
        return () => {
          console.log('ERROR:', ev, ' - user was logged out');
          messageService.loginPopup();
          return userSessionService.unload()
            .then(()=>{
                delete $rootScope.user;
            });
        }
      }

      const checkActivationState = (state, params) => {
        let allowedRoutes = ['app.logout', 'app.activate'];
        if (params.key) {
         return params.key !== 'openpreview'
       } else {
         return allowedRoutes.indexOf(state.name) === -1;
       }
      }

      $rootScope.videoComplete = true;
      $rootScope.resume = false;
      $rootScope.currentVideoFile = null;
      $rootScope.currentKey = null;

      $rootScope.getCurrentUser = () => {
        return $rootScope.hasCurrentUser();
      }

      $rootScope.hasCurrentUser = () => {
        if (!$rootScope.user) { return undefined; }
        return Object.keys($rootScope.user).length ? $rootScope.user : undefined;
      }

      $rootScope.hasJessicasRoom = () => {
        return Object.keys($rootScope.user).length ? $rootScope.user.jessicas_room : false;
      }

      $rootScope.isActivated = () => {
        if (!$rootScope.hasCurrentUser()) { return false; }
        return $rootScope.user.activation_codes.length ? true : false;
      }

      $rootScope.showResume = () => {
        if ($rootScope.getCurrentUser() && $rootScope.user.current_file) {
          return (($rootScope.videoComplete || $rootScope.notWatching) && $rootScope.isActivated());
        } else {
          return false;
        }
      }

      $rootScope.inLessons = () => {
        if (!$rootScope.hasCurrentUser()) { return false; }
        return (['your_move','eat_smart']).indexOf($rootScope.user.app_type) > -1;
      }

      $rootScope.surveys = [];

      $rootScope.$on('auth:validation-success', function(ev, user) {
        if (~window.location.href.indexOf('password-reset')) {
          return;
        } else {
          userSessionService.load(user);
        }
      });

      $rootScope.$on('auth:login-success', function(ev, user) {
        if (~window.location.href.indexOf('password-reset')) {
          return;
        } else {
          userSessionService.load(user);
        }
      });

      $rootScope.$on('auth:invalid', logout('auth:invalid'));

      $rootScope.$on('auth:validation-error', logout('auth:validation-error'));

      $rootScope.$on('auth:session-expired', logout('auth:session-expired'));

      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
        let videoRoutes = ['app.section', 'app.lesson', 'app.makeup-lesson']
        $rootScope.notWatching = (!(videoRoutes.indexOf(toState.name) > -1));
        // IF a state requires an authorized user
        if (toState.requiresAuth){
          // first we check if the user has an activation code and if they are going to an allowed route without an activation code
          // if they are attempting to access a different part of the app other than the preview, we stop them
          if (!$rootScope.isActivated() && checkActivationState(toState, toParams)) {
            event.preventDefault();
          } else {
            // if they do have an activation code, we just validate that the user is signed in and redirect to the access page if not authorized
            return $auth.validateUser().catch((err)=>{
              $state.go('app.access', {}, { reload:true });
            });
          }
        }
      });

    });

})()
