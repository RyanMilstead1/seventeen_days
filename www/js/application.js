'use strict';

(function () {

  /*
   * Seventeen Days
   */

  var appDependencies = ['ionic', 'ngResource', 'ngSanitize', 'ngAnimate', 'ngRoute', 'ngCookies', 'LocalStorageModule', 'ui.router.compat', 'com.2fdevs.videogular', 'com.2fdevs.videogular.plugins.controls', 'com.2fdevs.videogular.plugins.overlayplay', 'com.2fdevs.videogular.plugins.buffering', 'ng-token-auth'];

  angular.module('seventeendays', appDependencies).config(["localStorageServiceProvider", function (localStorageServiceProvider) {
    localStorageServiceProvider.prefix = 'seventeendays';
  }]);
})();
'use strict';

(function () {

  angular.module('seventeendays').config(["$authProvider", "ENDPOINTS", function ($authProvider, ENDPOINTS) {
    $authProvider.configure({
      apiUrl: ENDPOINTS.API,
      storage: 'localStorage',
      omniauthWindowType: window.cordova == undefined ? 'sameWindow' : 'inAppBrowser',
      authProviderPaths: {
        twitter: '/auth/twitter',
        facebook: '/auth/facebook',
        instagram: '/auth/instagram'
      },
      passwordResetSuccessUrl: window.location.origin + '/#/app/password-reset'
    });
  }]);
})();
'use strict';

(function () {

  angular.module('seventeendays').config(["$stateProvider", "$urlRouterProvider", "$sceDelegateProvider", "ENDPOINTS", function ($stateProvider, $urlRouterProvider, $sceDelegateProvider, ENDPOINTS) {
    $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    ENDPOINTS.API + '/**']);

    $stateProvider.state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "views/menu.html",
      controller: 'MainCtrl'
    }).state('app.access', {
      requiresAuth: false,
      url: "/access",
      views: {
        'menuContent': {
          templateUrl: "views/access.html",
          controller: 'AccessCtrl'
        }
      }
    }).state('app.activate', {
      requiresAuth: true,
      url: "/activate",
      views: {
        'menuContent': {
          templateUrl: "views/activate.html",
          controller: 'ActivateCtrl'
        }
      }
    }).state('app.login', {
      requiresAuth: false,
      url: "/login",
      views: {
        'menuContent': {
          templateUrl: "views/login.html",
          controller: 'LoginCtrl'
        }
      }
    }).state('app.logout', {
      requiresAuth: false,
      url: "/logout",
      views: {
        'menuContent': {
          template: '',
          controller: 'LogoutCtrl'
        }
      }
    }).state('app.register', {
      requiresAuth: false,
      url: "/register?activationCode",
      views: {
        'menuContent': {
          templateUrl: "views/register.html",
          controller: 'RegisterCtrl'
        }
      }
    }).state('app.preview', {
      requiresAuth: false,
      url: "/preview",
      views: {
        'menuContent': {
          templateUrl: "views/preview.html",
          controller: 'PreviewCtrl'
        }
      }
    }).state('app.register-confirm', {
      requiresAuth: true,
      url: "/register-confirm",
      views: {
        'menuContent': {
          templateUrl: "views/register-confirm.html",
          controller: 'RegisterCtrl'
        }
      }
    }).state('app.password-reset', {
      requiresAuth: false,
      url: "/password-reset",
      views: {
        'menuContent': {
          templateUrl: "views/password-reset.html",
          controller: 'PasswordResetCtrl'
        }
      }
    }).state('app.reset-request', {
      requiresAuth: false,
      url: "/password-reset-request",
      views: {
        'menuContent': {
          templateUrl: "views/reset-request.html",
          controller: 'ResetRequestCtrl'
        }
      }
    }).state('app.lesson-code', {
      requiresAuth: true,
      url: "/lesson-code",
      views: {
        'menuContent': {
          templateUrl: 'views/lesson-code.html',
          controller: 'LessonCodeCtrl'
        }
      }
    }).state('app.makeup-lesson-code', {
      requiresAuth: true,
      url: "/makeup-lesson-code",
      views: {
        'menuContent': {
          templateUrl: 'views/makeup-lesson-code.html',
          controller: 'MakeupLessonCodeCtrl'
        }
      }
    }).state('app.section', {
      requiresAuth: true,
      url: "/section/:key",
      views: {
        'menuContent': {
          templateUrl: function templateUrl($stateParams) {
            return 'views/' + $stateParams.key + '.html';
          }
        }
      }
    }).state('app.lesson', {
      requiresAuth: true,
      url: '/lessons/:key',
      views: {
        'menuContent': {
          templateUrl: function templateUrl($stateParams) {
            return 'views/lessons/' + $stateParams.key + '.html';
          }
        }
      }
    }).state('app.makeup-lesson', {
      requiresAuth: true,
      url: '/makeup-lessons/:key',
      views: {
        'menuContent': {
          templateUrl: function templateUrl($stateParams) {
            return 'views/makeup-lessons/' + $stateParams.key + '.html';
          }
        }
      }
    });

    $urlRouterProvider.otherwise('/app/access');
  }]);
})();
'use strict';

(function () {

  angular.module('seventeendays').run(["$rootScope", "$state", "messageService", "$auth", "$http", "$ionicLoading", "userSessionService", function ($rootScope, $state, messageService, $auth, $http, $ionicLoading, userSessionService) {

    var logout = function logout(ev) {
      return function () {
        console.log('ERROR:', ev, ' - user was logged out');
        messageService.loginPopup();
        return userSessionService.unload().then(function () {
          delete $rootScope.user;
        });
      };
    };

    var checkActivationState = function checkActivationState(state, params) {
      var allowedRoutes = ['app.logout', 'app.activate'];
      if (params.key) {
        return params.key !== 'openpreview';
      } else {
        return allowedRoutes.indexOf(state.name) === -1;
      }
    };

    $rootScope.videoComplete = true;
    $rootScope.resume = false;
    $rootScope.currentVideoFile = null;
    $rootScope.currentKey = null;

    $rootScope.getCurrentUser = function () {
      return $rootScope.hasCurrentUser();
    };

    $rootScope.hasCurrentUser = function () {
      if (!$rootScope.user) {
        return undefined;
      }
      return Object.keys($rootScope.user).length ? $rootScope.user : undefined;
    };

    $rootScope.hasJessicasRoom = function () {
      return Object.keys($rootScope.user).length ? $rootScope.user.jessicas_room : false;
    };

    $rootScope.isActivated = function () {
      if (!$rootScope.hasCurrentUser()) {
        return false;
      }
      return $rootScope.user.activation_codes.length ? true : false;
    };

    $rootScope.showResume = function () {
      if ($rootScope.getCurrentUser() && $rootScope.user.current_file) {
        return ($rootScope.videoComplete || $rootScope.notWatching) && $rootScope.isActivated();
      } else {
        return false;
      }
    };

    $rootScope.inLessons = function () {
      if (!$rootScope.hasCurrentUser()) {
        return false;
      }
      return ['your_move', 'eat_smart'].indexOf($rootScope.user.app_type) > -1;
    };

    $rootScope.surveys = [];

    $rootScope.$on('auth:validation-success', function (ev, user) {
      if (~window.location.href.indexOf('password-reset')) {
        return;
      } else {
        userSessionService.load(user);
      }
    });

    $rootScope.$on('auth:login-success', function (ev, user) {
      if (~window.location.href.indexOf('password-reset')) {
        return;
      } else {
        userSessionService.load(user);
      }
    });

    $rootScope.$on('auth:invalid', logout('auth:invalid'));

    $rootScope.$on('auth:validation-error', logout('auth:validation-error'));

    $rootScope.$on('auth:session-expired', logout('auth:session-expired'));

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
      var videoRoutes = ['app.section', 'app.lesson', 'app.makeup-lesson'];
      $rootScope.notWatching = !(videoRoutes.indexOf(toState.name) > -1);
      // IF a state requires an authorized user
      if (toState.requiresAuth) {
        // first we check if the user has an activation code and if they are going to an allowed route without an activation code
        // if they are attempting to access a different part of the app other than the preview, we stop them
        if (!$rootScope.isActivated() && checkActivationState(toState, toParams)) {
          event.preventDefault();
        } else {
          // if they do have an activation code, we just validate that the user is signed in and redirect to the access page if not authorized
          return $auth.validateUser().catch(function (err) {
            $state.go('app.access', {}, { reload: true });
          });
        }
      }
    });
  }]);
})();
'use strict';

(function () {

  /*
   * Stores application data.
   */
  angular.module('seventeendays').constant('DATA', {
    // NOTE: Data model here is still not optimal, but this
    // provides for a cleaner service layer when working with data.
    // At this juncture, we prefer to explicitly list
    // step properties rather than computing them with a
    // heuristic (e.g., eva(cog1).html => { marker: (Cog1) }).
    steps: {
      'opencog1.html': { thisaction: 'timestamp', marker: 'Cog0' },
      'open2.html': { marker: 'CogCondom1' },
      'open3.html': { marker: 'CogCondom2' },
      'evacog1.html': { marker: 'EvaCog1' },
      'evacog2.html': { marker: 'EvaCog2' },
      'evacog3.html': { marker: 'EvaCog3' },
      'evacog4.html': { marker: 'EvaCog4' },
      'evacog5.html': { marker: 'EvaCog5' },
      'haileycog1.html': { marker: 'HaileyCog1' },
      'haileycog2.html': { marker: 'HaileyCog2' },
      'haileycog3.html': { marker: 'HaileyCog3' },
      'haileycog4.html': { marker: 'HaileyCog4' },
      'haileycog5.html': { marker: 'HaileyCog5' },
      'isabelcog1.html': { marker: 'IsabelCog1' },
      'isabelcog2.html': { marker: 'IsabelCog2' },
      'isabelcog3.html': { marker: 'IsabelCog3' },
      'isabelcog4.html': { marker: 'IsabelCog4' },
      'isabelcog5.html': { marker: 'IsabelCog5' },
      'laurencog1.html': { marker: 'LaurenCog1' },
      'laurencog2.html': { marker: 'LaurenCog2' },
      'laurencog3.html': { marker: 'LaurenCog3' },
      'laurencog4.html': { marker: 'LaurenCog4' },
      'laurencog5.html': { marker: 'LaurenCog5' },
      'mayacog1.html': { marker: 'MayaCog1' },
      'mayacog2.html': { marker: 'MayaCog2' },
      'mayacog3.html': { marker: 'MayaCog3' },
      'mayacog4.html': { marker: 'MayaCog4' },
      'mayacog5.html': { marker: 'MayaCog5' },
      'nickicog1.html': { marker: 'NickiCog1' },
      'nickicog2.html': { marker: 'NickiCog2' },
      'nickicog3.html': { marker: 'NickiCog3' },
      'nickicog4.html': { marker: 'NickiCog4' },
      'nickicog5.html': { marker: 'NickiCog5' }
    },
    paths: {
      open: {
        "opening": { "label": "Opening sequence", "redirect": "bonfire", "redirectView": true, "steps": ["open1.mp4", "opencog1.html", "open2.mp4", "open2.html", "open3.mp4", "open3.html", "open4noquit.mp4"] }
      },
      openpreview: {
        "opening": { "label": "Preview", "steps": ["open1.mp4"] }
      },
      close: {
        "opening": { "label": "Closing sequence", "redirect": "jessica", "redirectView": true, "steps": ["wrapup1.mp4", "wrapup2.mp4", "lastscene.mp4", "jessicasroom.mp4"] }
      },
      eva: {
        "opening": { "action": "timestamp", "marker": "EvaOpen", "steps": ["evaopen.mp4", "evachoice1.html"] },
        "evachoice1a": { "label": "Pretty convincing", "action": "increment", "marker": "EvaChoice1a", "steps": ["evachoice1a.mp4", "evachoice2.html"] },
        "evachoice1b": { "label": "You dont know me", "action": "increment", "marker": "EvaChoice1b", "redirect": "evachoice1a", "steps": ["evachoice1c.mp4", "evacog1.html", "evaend1bc.mp4"] },
        "evachoice1c": { "label": "Not here for that", "action": "increment", "marker": "EvaChoice1c", "redirect": "evachoice1a", "steps": ["evachoice1b.mp4", "evacog1.html", "evaend1bc.mp4"] },
        "evachoice2a": { "label": "Lets go", "action": "increment", "marker": "EvaChoice2a", "steps": ["evachoice2a.mp4", "evachoice3.html"] },
        "evachoice2b": { "label": "I want to stay here", "action": "increment", "marker": "EvaChoice2b", "redirect": "evachoice2a", "steps": ["evachoice2b.mp4", "evacog2.html", "evaend2bc.mp4"] },
        "evachoice2c": { "label": "I have to help Lauren", "action": "increment", "marker": "EvaChoice2c", "redirect": "evachoice2a", "steps": ["evachoice2c.mp4", "evacog2.html", "evaend2bc.mp4"] },
        "evachoice3a": { "label": "Wow nice", "action": "increment", "marker": "EvaChoice3a", "steps": ["evachoice3a.mp4", "evachoice4.html"] },
        "evachoice3b": { "label": "Keep my clothes on", "action": "increment", "marker": "EvaChoice3b", "redirect": "evachoice3a", "steps": ["evachoice3b.mp4", "evacog3.html", "evaend3bc.mp4"] },
        "evachoice3c": { "label": "Dont know you", "action": "increment", "marker": "EvaChoice3c", "redirect": "evachoice3a", "steps": ["evachoice3c.mp4", "evacog3.html", "evaend3bc.mp4"] },
        "evachoice4a": { "label": "Do you have a condom", "action": "increment", "marker": "EvaChoice4a", "steps": ["evachoice4a.mp4", "evachoice4b.mp4", "evacog4-1.html", "eva4b-2.mp4", "evacog4-2.html", "evaend4bc.mp4"] },
        "evachoice4b": { "label": "I have one", "action": "increment", "marker": "EvaChoice4b", "steps": ["evachoice4b.mp4", "evacog4-1.html", "eva4b-2.mp4", "evacog4-2.html", "evaend4bc.mp4"] },
        "evachoice4c": { "label": "In my pocket", "action": "increment", "marker": "EvaChoice4c", "steps": ["evachoice4c.mp4", "evacog4-1.html", "eva4c-2.mp4", "evacog4-2.html", "evaend4bc.mp4"] }
      },
      hailey: {
        "opening": { "action": "timestamp", "marker": "HaileyOpen", "steps": ["haileyopen.mp4", "haileychoice1.html"] },
        "haileychoice1a": { "label": "Mmm", "action": "increment", "marker": "HaileyChoice1a", "steps": ["haileychoice1a.mp4", "haileychoice2.html"] },
        "haileychoice1b": { "label": "Turn into a frog", "action": "increment", "marker": "HaileyChoice1b", "redirect": "haileychoice1a", "steps": ["haileychoice1b.mp4", "haileycog1.html", "haileyend1bc.mp4"] },
        "haileychoice1c": { "label": "Second kiss on my terms", "action": "increment", "marker": "HaileyChoice1c", "redirect": "haileychoice1a", "steps": ["haileychoice1c.mp4", "haileycog1.html", "haileyend1bc.mp4"] },
        "haileychoice2a": { "label": "Okay", "action": "increment", "marker": "HaileyChoice2a", "steps": ["haileychoice2a.mp4", "haileychoice3.html"] },
        "haileychoice2b": { "label": "Rather hear your guitar", "action": "increment", "marker": "HaileyChoice2b", "redirect": "haileychoice2a", "steps": ["haileychoice2b.mp4", "haileycog2.html", "haileyend2bc.mp4"] },
        "haileychoice2c": { "label": "Im good where we are", "action": "increment", "marker": "HaileyChoice2c", "redirect": "haileychoice2a", "steps": ["haileychoice2c.mp4", "haileycog2.html", "haileyend2bc.mp4"] },
        "haileychoice3a": { "label": "Okay", "action": "increment", "marker": "HaileyChoice3a", "steps": ["haileychoice3a.mp4", "haileychoice4.html"] },
        "haileychoice3b": { "label": "Not tonight", "action": "increment", "marker": "HaileyChoice3b", "redirect": "haileychoice3a", "steps": ["haileychoice3b.mp4", "haileycog3.html", "haileyend3bc.mp4"] },
        "haileychoice3c": { "label": "Just make out", "action": "increment", "marker": "HaileyChoice3c", "redirect": "haileychoice3a", "steps": ["haileychoice3c.mp4", "haileycog3.html", "haileyend3bc.mp4"] },
        "haileychoice4a": { "label": "Do you have one", "action": "increment", "marker": "HaileyChoice4a", "steps": ["haileychoice4a.mp4", "haileychoice4b.mp4", "haileycog4-1.html", "hailey4b-2.mp4", "haileycog4-2.html", "haileyend4bc.mp4"] },
        "haileychoice4b": { "label": "Im prepared", "action": "increment", "marker": "HaileyChoice4b", "steps": ["haileychoice4b.mp4", "haileycog4-1.html", "hailey4b-2.mp4", "haileycog4-2.html", "haileyend4bc.mp4"] },
        "haileychoice4c": { "label": "Guess what I have?", "action": "increment", "marker": "HaileyChoice4c", "steps": ["haileychoice4c.mp4", "haileycog4-1.html", "hailey4c-2.mp4", "haileycog4-2.html", "haileyend4bc.mp4"] }
      },
      isabel: {
        "opening": { "action": "timestamp", "marker": "IsabelOpen", "steps": ["isabelopen.mp4", "isabelchoice1.html"] },
        "isabelchoice1a": { "label": "Okay", "action": "increment", "marker": "IsabelChoice1a", "steps": ["isabelchoice1a.mp4", "isabelchoice2.html"] },
        "isabelchoice1b": { "label": "Told Lauren Id help", "action": "increment", "marker": "IsabelChoice1b", "redirect": "isabelchoice1a", "steps": ["isabelchoice1b.mp4", "isabelcog1.html", "isabelend1bc.mp4"] },
        "isabelchoice1c": { "label": "Lets stay here", "action": "increment", "marker": "IsabelChoice1c", "redirect": "isabelchoice1a", "steps": ["isabelchoice1c.mp4", "isabelcog1.html", "isabelend1bc.mp4"] },
        "isabelchoice2a": { "label": "Me too", "action": "increment", "marker": "IsabelChoice2a", "steps": ["isabelchoice2a.mp4", "isabelchoice3.html"] },
        "isabelchoice2b": { "label": "I dont feel like it", "action": "increment", "marker": "IsabelChoice2b", "redirect": "isabelchoice2a", "steps": ["isabelchoice2b.mp4", "isabelcog2.html", "isabelend2bc.mp4"] },
        "isabelchoice2c": { "label": "Things will go too far", "action": "increment", "marker": "IsabelChoice2c", "redirect": "isabelchoice2a", "steps": ["isabelchoice2c.mp4", "isabelcog2.html", "isabelend2bc.mp4"] },
        "isabelchoice3a": { "label": "I heard that too", "action": "increment", "marker": "IsabelChoice3a", "steps": ["isabelchoice3a.mp4", "isabelchoice4.html"] },
        "isabelchoice3b": { "label": "Did we make up?", "action": "increment", "marker": "IsabelChoice3b", "redirect": "isabelchoice3a", "steps": ["isabelchoice3b.mp4", "isabelcog3.html", "isabelend3bc.mp4"] },
        "isabelchoice3c": { "label": "Keep doing this", "action": "increment", "marker": "IsabelChoice3c", "redirect": "isabelchoice3a", "steps": ["isabelchoice3c.mp4", "isabelcog3.html", "isabelend3bc.mp4"] },
        "isabelchoice4a": { "label": "Do you have a condom?", "action": "increment", "marker": "IsabelChoice4a", "steps": ["isabelchoice4a.mp4", "isabelchoice4b.mp4", "isabelcog4-1.html", "isabel4b-2.mp4", "isabelcog4-2.html", "isabelend4bc.mp4"] },
        "isabelchoice4b": { "label": "I have a condom", "action": "increment", "marker": "IsabelChoice4b", "steps": ["isabelchoice4b.mp4", "isabelcog4-1.html", "isabel4b-2.mp4", "isabelcog4-2.html", "isabelend4bc.mp4"] },
        "isabelchoice4c": { "label": "Got a condom today", "action": "increment", "marker": "IsabelChoice4c", "steps": ["isabelchoice4c.mp4", "isabelcog4-1.html", "isabel4c-2.mp4", "isabelcog4-2.html", "isabelend4bc.mp4"] }
      },
      lauren: {
        "opening": { "action": "timestamp", "marker": "LaurenOpen", "steps": ["laurenopen.mp4", "laurenchoice1.html"] },
        "laurenchoice1a": { "label": "Okay", "action": "increment", "marker": "LaurenChoice1a", "steps": ["laurenchoice1a.mp4", "laurenchoice2.html"] },
        "laurenchoice1b": { "label": "Go get the food", "action": "increment", "marker": "LaurenChoice1b", "redirect": "laurenchoice1a", "steps": ["laurenchoice1b.mp4", "laurencog1.html", "laurenend1bc.mp4"] },
        "laurenchoice1c": { "label": "I should stay here", "action": "increment", "marker": "LaurenChoice1c", "redirect": "laurenchoice1a", "steps": ["laurenchoice1c.mp4", "laurencog1.html", "laurenend1bc.mp4"] },
        "laurenchoice2a": { "label": "Okay", "action": "increment", "marker": "LaurenChoice2a", "steps": ["laurenchoice2a.mp4", "laurenchoice3.html"] },
        "laurenchoice2b": { "label": "Im not ready", "action": "increment", "marker": "LaurenChoice2b", "redirect": "laurenchoice2a", "steps": ["laurenchoice2b.mp4", "laurencog2.html", "laurenend2bc.mp4"] },
        "laurenchoice2c": { "label": "We got carried away", "action": "increment", "marker": "LaurenChoice2c", "redirect": "laurenchoice2a", "steps": ["laurenchoice2c.mp4", "laurencog2.html", "laurenend2bc.mp4"] },
        "laurenchoice3a": { "label": "Im ready", "action": "increment", "marker": "LaurenChoice3a", "steps": ["laurenchoice3a.mp4", "laurenchoice4.html"] },
        "laurenchoice3b": { "label": "I dont want to rush into something", "action": "increment", "marker": "LaurenChoice3b", "redirect": "laurenchoice3a", "steps": ["laurenchoice3b.mp4", "laurencog3.html", "laurenend3bc.mp4"] },
        "laurenchoice3c": { "label": "Keep doing this", "action": "increment", "marker": "LaurenChoice3c", "redirect": "laurenchoice3a", "steps": ["laurenchoice3c.mp4", "laurencog3.html", "laurenend3bc.mp4"] },
        "laurenchoice4a": { "label": "Do you have one?", "action": "increment", "marker": "LaurenChoice4a", "steps": ["laurenchoice4a.mp4", "laurenchoice4b.mp4", "laurencog4-1.html", "lauren4b-2.mp4", "laurencog4-2.html", "laurenend4bc.mp4"] },
        "laurenchoice4b": { "label": "I have one", "action": "increment", "marker": "LaurenChoice4b", "steps": ["laurenchoice4b.mp4", "laurencog4-1.html", "lauren4b-2.mp4", "laurencog4-2.html", "laurenend4bc.mp4"] },
        "laurenchoice4c": { "label": "Have one just in case", "action": "increment", "marker": "LaurenChoice4c", "steps": ["laurenchoice4c.mp4", "laurencog4-1.html", "lauren4c-2.mp4", "laurencog4-2.html", "laurenend4bc.mp4"] }
      },
      maya: {
        "opening": { "action": "timestamp", "marker": "MayaOpen", "steps": ["mayaopen.mp4", "mayachoice1.html"] },
        "mayachoice1a": { "label": "Okay", "action": "increment", "marker": "MayaChoice1a", "steps": ["mayachoice1a.mp4", "mayachoice2.html"] },
        "mayachoice1b": { "label": "You can handle it", "action": "increment", "marker": "MayaChoice1b", "redirect": "mayachoice1a", "steps": ["mayachoice1b.mp4", "mayacog1.html", "mayaend1bc.mp4"] },
        "mayachoice1c": { "label": "You go ahead", "action": "increment", "marker": "MayaChoice1c", "redirect": "mayachoice1a", "steps": ["mayachoice1c.mp4", "mayacog1.html", "mayaend1bc.mp4"] },
        "mayachoice2a": { "label": "That feels nice", "action": "increment", "marker": "MayaChoice2a", "steps": ["mayachoice2a.mp4", "mayachoice3.html"] },
        "mayachoice2b": { "label": "Thats far enough", "action": "increment", "marker": "MayaChoice2b", "redirect": "mayachoice2a", "steps": ["mayachoice2b.mp4", "mayacog2.html", "mayaend2bc.mp4"] },
        "mayachoice2c": { "label": "You need a time out", "action": "increment", "marker": "MayaChoice2c", "redirect": "mayachoice2a", "steps": ["mayachoice2c.mp4", "mayacog2.html", "mayaend2bc.mp4"] },
        "mayachoice3a": { "label": "Lets do it", "action": "increment", "marker": "MayaChoice3a", "steps": ["mayachoice3a.mp4", "mayachoice4.html"] },
        "mayachoice3b": { "label": "I like what were doing", "action": "increment", "marker": "MayaChoice3b", "redirect": "mayachoice3a", "steps": ["mayachoice3b.mp4", "mayacog3.html", "mayaend3bc.mp4"] },
        "mayachoice3c": { "label": "This isnt the right time", "action": "increment", "marker": "MayaChoice3c", "redirect": "mayachoice3a", "steps": ["mayachoice3c.mp4", "mayacog3.html", "mayaend3bc.mp4"] },
        "mayachoice4a": { "label": "Do you have a condom?", "action": "increment", "marker": "MayaChoice4a", "steps": ["mayachoice4a.mp4", "mayachoice4b.mp4", "mayacog4-1.html", "maya4b-2.mp4", "mayacog4-2.html", "mayaend4bc.mp4"] },
        "mayachoice4b": { "label": "I have one", "action": "increment", "marker": "MayaChoice4b", "steps": ["mayachoice4b.mp4", "mayacog4-1.html", "maya4b-2.mp4", "mayacog4-2.html", "mayaend4bc.mp4"] },
        "mayachoice4c": { "label": "Condom in my purse", "action": "increment", "marker": "MayaChoice4c", "steps": ["mayachoice4c.mp4", "mayacog4-1.html", "maya4c-2.mp4", "mayacog4-2.html", "mayaend4bc.mp4"] }
      },
      nicki: {
        "opening": { "action": "timestamp", "marker": "NickiOpen", "steps": ["nickiopen.mp4", "nickichoice1.html"] },
        "nickichoice1a": { "label": "Okay", "action": "increment", "marker": "NickiChoice1a", "steps": ["nickichoice1a.mp4", "nickichoice2.html"] },
        "nickichoice1b": { "label": "We hardly hang out", "action": "increment", "marker": "NickiChoice1b", "redirect": "nickichoice1a", "steps": ["nickichoice1b.mp4", "nickicog1.html", "nickiend1bc.mp4"] },
        "nickichoice1c": { "label": "Whats my name?", "action": "increment", "marker": "NickiChoice1c", "redirect": "nickichoice1a", "steps": ["nickichoice1c.mp4", "nickicog1.html", "nickiend1bc.mp4"] },
        "nickichoice2a": { "label": "Lets go", "action": "increment", "marker": "NickiChoice2a", "steps": ["nickichoice2a.mp4", "nickichoice3.html"] },
        "nickichoice2b": { "label": "Not so fast", "action": "increment", "marker": "NickiChoice2b", "redirect": "nickichoice2a", "steps": ["nickichoice2b.mp4", "nickicog2.html", "nickiend2bc.mp4"] },
        "nickichoice2c": { "label": "I told Lauren", "action": "increment", "marker": "NickiChoice2c", "redirect": "nickichoice2a", "steps": ["nickichoice2c.mp4", "nickicog2.html", "nickiend2bc.mp4"] },
        "nickichoice3a": { "label": "I want you too", "action": "increment", "marker": "NickiChoice3a", "steps": ["nickichoice3a.mp4", "nickichoice4.html"] },
        "nickichoice3b": { "label": "Im not ready", "action": "increment", "marker": "NickiChoice3b", "redirect": "nickichoice3a", "steps": ["nickichoice3b.mp4", "nickicog3.html", "nickiend3bc.mp4"] },
        "nickichoice3c": { "label": "Moving too fast", "action": "increment", "marker": "NickiChoice3c", "redirect": "nickichoice3a", "steps": ["nickichoice3c.mp4", "nickicog3.html", "nickiend3bc.mp4"] },
        "nickichoice4a": { "label": "Do you have a condom?", "action": "increment", "marker": "NickiChoice4a", "steps": ["nickichoice4a.mp4", "nickichoice4b.mp4", "nickicog4-1.html", "nicki4b-2.mp4", "nickicog4-2.html", "nickiend4bc.mp4"] },
        "nickichoice4b": { "label": "I have a condom", "action": "increment", "marker": "NickiChoice4b", "steps": ["nickichoice4b.mp4", "nickicog4-1.html", "nicki4b-2.mp4", "nickicog4-2.html", "nickiend4bc.mp4"] },
        "nickichoice4c": { "label": "Condom carrier", "action": "increment", "marker": "NickiChoice4c", "steps": ["nickichoice4c.mp4", "nickicog4-1.html", "nicki4c-2.mp4", "nickicog4-2.html", "nickiend4bc.mp4"] }
      },
      bonfire: {
        "eva": { "steps": ["app.eva"] },
        "hailey": { "steps": ["app.hailey"] },
        "isabel": { "steps": ["app.isabel"] },
        "lauren": { "steps": ["app.lauren"] },
        "maya": { "steps": ["app.maya"] },
        "nicki": { "steps": ["app.nicki"] }
      },
      jessica: {
        "opening": { "label": "Jessica Menu", "steps": ["jessicamenu.html"] },
        "jessicachoice1a": { "label": "Going to the gynecologist", "action": "timestamp", "marker": "Gyno", "redirect": "opening", "steps": ["gyneexam.mp4", "gynecog1.mp4", "gynecog1.html", "gynecog2.mp4", "gynecog2.html"] },
        "jessicachoice1b": { "label": "I got birth control and so can you", "redirect": "birthcontrol", "redirectView": true, "steps": ["bcintro.mp4", "bccog1.mp4", "bccog1.html", "bccog2.mp4", "bccog2.html", "bccog3.mp4", "bccog3.html"] },
        "jessicachoice1c": { "label": "Know your body", "redirect": "kyb", "redirectView": true, "steps": ["kyb.mp4"] },
        "jessicachoice1d": { "label": "Watch out for STis", "action": "timestamp", "marker": "STI", "redirect": "stimain", "redirectView": true, "steps": ["riskometer.mp4"] },
        "jessicachoice1e": { "label": "Haileys condom dos and donts", "action": "timestamp", "marker": "CondomDosAndDonts", "redirect": "opening", "steps": ["open2-jessicasroom.mp4", "opencog2.html", "open3.mp4", "opencog3.html", "open4-jessicasroom.mp4"] },
        "jessicachoice1f": { "label": "Jessica and her friends", "redirect": "bonfire", "redirectView": true, "steps": ["open4quit-jessicasroom.mp4"] }
      },
      birthcontrol: {
        "opening": { "action": "timestamp", "marker": "BCOpen", "steps": ["bcmain.html"] },
        "bc1a": { "action": "increment", "marker": "BCdetailEC", "redirect": "opening", "steps": ["ec.mp4"] },
        "bc1b": { "action": "increment", "marker": "BCdetailPill", "redirect": "opening", "steps": ["thepill.mp4"] },
        "bc1c": { "action": "increment", "marker": "BCdetailDepo", "redirect": "opening", "steps": ["depo.mp4"] },
        "bc1d": { "action": "increment", "marker": "BCdetailNuva", "redirect": "opening", "steps": ["nuva.mp4"] },
        "bc1e": { "action": "increment", "marker": "BCdetailPatch", "redirect": "opening", "steps": ["patch.mp4"] },
        "bc1f": { "action": "increment", "marker": "BCdetailCondoms", "redirect": "opening", "steps": ["condoms.mp4"] },
        "bc1g": { "action": "increment", "marker": "BCdetailImplant", "redirect": "opening", "steps": ["implant.mp4"] },
        "bc1h": { "action": "increment", "marker": "BCdetailIUD", "redirect": "opening", "steps": ["iud.mp4"] },
        "bc1i": { "action": "increment", "marker": "BCdetailOther", "redirect": "opening", "steps": ["othermethods.mp4"] }
      },
      stimain: {
        "opening": { "steps": ["sti-main.html"] },
        "stimn1a": { "action": "increment", "marker": "STIdetailWhat", "redirect": "opening", "steps": ["whatcausesstis.mp4"] },
        "stimn2a": { "action": "increment", "marker": "STIdetailKnow", "redirect": "opening", "steps": ["howdoyouknow.mp4"] },
        "stimn3a": { "action": "increment", "marker": "STIdetailGet", "redirect": "opening", "steps": ["howdoyouget.mp4"] },
        "stimn4a": { "action": "increment", "marker": "STIdetailHave", "redirect": "opening", "steps": ["whatifyouhave.mp4"] },
        "stimn5a": { "action": "increment", "marker": "STIdetailSymptoms", "redirect": "opening", "steps": ["whataresymptoms.mp4"] },
        "stimn6a": { "action": "increment", "marker": "STIdetailMain", "redirect": "opening", "steps": ["mainstis.mp4"] },
        "stimn7a": { "action": "increment", "marker": "STIdetailPlushies", "redirect": "stiwhat", "redirectView": true, "steps": ["plushies.mp4"] }
      },
      kyb: {
        "opening": { "action": "timestamp", "marker": "KYBOpen", "steps": ["kyb.html"] },
        "kyb1": { "action": "increment", "marker": "KYBdetailOuterLabia", "redirect": "opening", "steps": ["labia.mp4"] },
        "kyb2": { "action": "increment", "marker": "KYBdetailUrethra", "redirect": "opening", "steps": ["urethra.mp4"] },
        "kyb3": { "action": "increment", "marker": "KYBdetailVulva", "redirect": "opening", "steps": ["vulva.mp4"] },
        "kyb4": { "action": "increment", "marker": "KYBdetailClitoris", "redirect": "opening", "steps": ["clitoris.mp4"] },
        "kyb5": { "action": "increment", "marker": "KYBdetailInnerLabia", "redirect": "opening", "steps": ["labia.mp4"] },
        "kyb6": { "action": "increment", "marker": "KYBdetailFallopian", "redirect": "opening", "steps": ["fallopian_tubes.mp4"] },
        "kyb7": { "action": "increment", "marker": "KYBdetailOvaries", "redirect": "opening", "steps": ["ovaries.mp4"] },
        "kyb8": { "action": "increment", "marker": "KYBdetailUterus", "redirect": "opening", "steps": ["uterus.mp4"] },
        "kyb9": { "action": "increment", "marker": "KYBdetailCervix", "redirect": "opening", "steps": ["cervix.mp4"] },
        "kyb10": { "action": "increment", "marker": "KYBdetailVagina", "redirect": "opening", "steps": ["vagina.mp4"] }
      },
      stiwhat: {
        "opening": { "steps": ["stis.html"] },
        "stiWhat1a": { "action": "increment", "marker": "STIdetailHerpes", "redirect": "opening", "steps": ["herpes.mp4"] },
        "stiWhat2a": { "action": "increment", "marker": "STIdetailGonorrhea", "redirect": "opening", "steps": ["gonorrhea.mp4"] },
        "stiWhat3a": { "action": "increment", "marker": "STIdetailChlamydia", "redirect": "opening", "steps": ["chlamydia.mp4"] },
        "stiWhat4a": { "action": "increment", "marker": "STIdetailTrich", "redirect": "opening", "steps": ["trich.mp4"] },
        "stiWhat5a": { "action": "increment", "marker": "STIdetailHepatitis", "redirect": "opening", "steps": ["hepatitis.mp4"] },
        "stiWhat6a": { "action": "increment", "marker": "STIdetailSyphilis", "redirect": "opening", "steps": ["syphilis.mp4"] },
        "stiWhat7a": { "action": "increment", "marker": "STIdetailHPV", "redirect": "opening", "steps": ["hpv.mp4"] },
        "stiWhat8a": { "action": "increment", "marker": "STIdetailHIV", "redirect": "opening", "steps": ["hiv.mp4"] }
      },
      // Curriculm breakout paths
      // New path attributes:
      // "lessonEnd" - flag for the workflow service to redirect user to lesson code entry page
      // "countdownTime" - numeric value for timer that will send user to lesson code entry page after time value (in seconds) expires
      lesson1: {
        "opening": { "label": "Lesson 1", "redirect": "bonfire", "action": "timestamp", "marker": "Lesson1", "redirectView": true, "steps": ["YM-1-PR-Intro-V3.mp4"] }
      },
      lesson1close: {
        "opening": { "label": "Lesson 1 close", "steps": ["YM-1-PR-Outro-V2.mp4"], "lessonEnd": true }
      },
      lesson2: {
        "opening": { "label": "Lesson 2", "redirect": "bonfire", "action": "timestamp", "marker": "Lesson2", "redirectView": true, "steps": ["YM-2-PR-Intro-V2.mp4"] }
      },
      lesson2close: {
        "opening": { "label": "Lesson 2 close", "steps": ["YM-2-PR-Outro-V2.mp4"], "lessonEnd": true }
      },
      lesson3: {
        "opening": { "label": "Lesson 3", "redirect": "kyb", "action": "timestamp", "marker": "Lesson3", "redirectView": true, "steps": ["YM-3-PR.mp4"], "lessonEnd": true, "countdownTime": 180 }
      },
      lesson4: {
        "opening": { "label": "Lesson 4", "action": "timestamp", "marker": "Lesson4", "steps": ["YM-4-PR.mp4"], "lessonEnd": true }
      },
      lesson5: {
        "opening": { "label": "Lesson 5", "redirect": "birthcontrol", "action": "timestamp", "marker": "Lesson5", "redirectView": true, "steps": ["YM-5-PR-A1.mp4", "gynecog1.html", "YM-5-PR-A2.mp4", "gynecog2.html", "YM-5-PR-A3.mp4", "YM-5-PR-B-V3.mp4", "condoms.mp4", "YM-5-PR-C-V2.mp4"], "lessonEnd": true, "countdownTime": 180 }
      },
      lesson6: {
        "opening": { "label": "Lesson 6", "redirect": "stimain", "action": "timestamp", "marker": "Lesson6", "redirectView": true, "steps": ["YM-6-PR.mp4"], "lessonEnd": true, "countdownTime": 180 }
      },
      lesson7: {
        "opening": { "label": "Lesson 7", "action": "timestamp", "redirect": "bonfire", "redirectView": true, "marker": "Lesson7", "steps": ["YM-7-PR-Intro.mp4"] }
      },
      lesson7close: {
        "opening": { "label": "Lesson 7 close", "steps": ["YM-7-PR-Outro.mp4"], "lessonEnd": true }
      },
      eslesson1: {
        "opening": { "label": "ES Lesson 1", "action": "timestamp", "marker": "ESLesson1", "steps": ["ES-1-PR.mp4"], "lessonEnd": true }
      },
      eslesson2: {
        "opening": { "label": "ES Lesson 2", "action": "timestamp", "marker": "ESLesson2", "steps": ["ES-2-PR.mp4"], "lessonEnd": true }
      },
      eslesson3: {
        "opening": { "label": "ES Lesson 3", "action": "timestamp", "marker": "ESLesson3", "steps": ["ES-3-PR.mp4"], "lessonEnd": true }
      },
      eslesson4: {
        "opening": { "label": "ES Lesson 4", "action": "timestamp", "marker": "ESLesson4", "steps": ["ES-4-PR.mp4"], "lessonEnd": true }
      },
      eslesson5: {
        "opening": { "label": "ES Lesson 5", "action": "timestamp", "marker": "ESLesson5", "steps": ["ES-5-PR.mp4"], "lessonEnd": true }
      },
      eslesson6: {
        "opening": { "label": "ES Lesson 6", "action": "timestamp", "marker": "ESLesson6", "steps": ["ES-6-PR.mp4"], "lessonEnd": true }
      },
      eslesson7: {
        "opening": { "label": "ES Lesson 7", "action": "timestamp", "marker": "ESLesson7", "steps": ["ES-7-PR.mp4"], "lessonEnd": true }
      },
      // Makup lesson data flow
      makeuplesson1: {
        "opening": { "label": "Makeup Lesson 1", "redirect": "bonfire", "action": "timestamp", "marker": "MakeupLesson1", "redirectView": true, "steps": ["YM-1-1-V2.mp4", "YM-1-2-V3.mp4", "YM-1-PR-Intro-V3.mp4"] }
      },
      makeuplesson1close: {
        "opening": { "label": "Makeup Lesson 1 close", "steps": ["YM-1-PR-Outro-V2.mp4"], "lessonEnd": true }
      },
      // Short version of bonfire intro followed by full single girl story
      makeuplesson2: {
        "opening": { "label": "Makup Lesson 2", "redirect": "bonfire", "action": "timestamp", "marker": "MakeupLesson2", "redirectView": true, "steps": ["YM-2-3-V3.mp4", "YM-2-PR-Intro-V2.mp4"] }
      },
      makeuplesson2close: {
        "opening": { "label": "Makup Lesson 2 close", "steps": ["YM-2-PR-Outro-V2.mp4"], "lessonEnd": true }
      },
      // Know your body mini documentary
      makeuplesson3: {
        "opening": { "label": "Makup Lesson 3", "redirect": "kyb", "action": "timestamp", "marker": "MakeupLesson3", "redirectView": true, "steps": ["YM-3-3a-V2.mp4", "YM-3-3b-V2.mp4", "YM-3-PR.mp4"], "lessonEnd": true, "countdownTime": 180 }
      },
      // Condom scene, cognitive rehearsals (Open2, 11:22 - 12:40/end and Open3 all)
      makeuplesson4: {
        "opening": { "label": "Makup Lesson 4", "action": "timestamp", "marker": "MakeupLesson4", "steps": ["YM-4-2-V2.mp4", "YM-4-PR.mp4"], "lessonEnd": true }
      },
      // gynecologist mini documentary
      makeuplesson5: {
        "opening": { "label": "Makup Lesson 5", "redirect": "birthcontrol", "action": "timestamp", "marker": "MakeupLesson5", "redirectView": true, "steps": ["YM-5-1-V2.mp4", "YM-5-2.mp4", "YM-5-PR-A1.mp4", "gynecog1.html", "YM-5-PR-A2.mp4", "gynecog2.html", "YM-5-PR-A3.mp4", "YM-5-PR-B-V3.mp4", "condoms.mp4", "YM-5-PR-C-V2.mp4"], "lessonEnd": true, "countdownTime": 180 }
      },
      // STI's 9:21 - 10:10 then reports menu for perusing
      makeuplesson6: {
        "opening": { "label": "Makup Lesson 6", "redirect": "stimain", "action": "timestamp", "marker": "MakeupLesson6", "redirectView": true, "steps": ["YM-6-1-V2.mp4", "YM-6-2.mp4", "YM-6-PR.mp4"], "lessonEnd": true, "countdownTime": 180 }
      },
      makeuplesson7: {
        "opening": { "label": "Makup Lesson 7", "action": "timestamp", "redirect": "bonfire", "redirectView": true, "marker": "MakeupLesson7", "steps": ["YM-7-1-V2.mp4", "YM-7-PR-Intro.mp4"] }
      },
      makeuplesson7close: {
        "opening": { "label": "Makeup Lesson 7 close", "steps": ["YM-7-PR-Outro.mp4"], "lessonEnd": true }
      },
      makeupeslesson1: {
        "opening": { "label": "Makup ES Lesson 1", "action": "timestamp", "marker": "MakeupESLesson1", "steps": ["ES-1-1.mp4", "ES-1-PR.mp4"], "lessonEnd": true }
      },
      makeupeslesson2: {
        "opening": { "label": "Makup ES Lesson 2", "action": "timestamp", "marker": "MakeupESLesson2", "steps": ["ES-2-1.mp4", "ES-2-PR.mp4"], "lessonEnd": true }
      },
      makeupeslesson3: {
        "opening": { "label": "Makup ES Lesson 3", "action": "timestamp", "marker": "MakeupESLesson3", "steps": ["ES-3-1.mp4", "ES-3-PR.mp4"], "lessonEnd": true }
      },
      makeupeslesson4: {
        "opening": { "label": "Makup ES Lesson 4", "action": "timestamp", "marker": "MakeupESLesson4", "steps": ["ES-4-1.mp4", "ES-4-PR.mp4"], "lessonEnd": true }
      },
      makeupeslesson5: {
        "opening": { "label": "Makup ES Lesson 5", "action": "timestamp", "marker": "MakeupESLesson5", "steps": ["ES-5-1.mp4", "ES-5-PR.mp4"], "lessonEnd": true }
      },
      makeupeslesson6: {
        "opening": { "label": "Makup ES Lesson 6", "action": "timestamp", "marker": "MakeupESLesson6", "steps": ["ES-6-1.mp4", "ES-6-PR.mp4"], "lessonEnd": true }
      },
      makeupeslesson7: {
        "opening": { "label": "Makup ES Lesson 7", "action": "timestamp", "marker": "MakeupESLesson7", "steps": ["ES-7-1.mp4", "ES-7-PR.mp4"], "lessonEnd": true }
      }
    }
  });
})();
'use strict';

(function () {

  angular.module('seventeendays').constant('FRIENDLY_ERRORS', {
    getMessage: function getMessage(key, defolt) {
      return this.get(key, defolt);
    },
    getException: function getException(key, defolt) {
      var e = this.get(key, defolt);
      return { exception: e };
    },
    get: function get(key, defolt) {
      defolt = defolt || 'default';
      try {
        return this[key] || this[defolt];
      } catch (z) {
        return this[defolt];
      }
    },
    'default': 'An error occurred.',
    'login.default': 'An error occured. Please try again.',
    'login.emailIsInvalid': 'Invalid email format.',
    'login.emailPasswordRequired': 'Email and password are required.',
    'login.unauthorized': 'The email/password entered is incorrect',
    'register.default': 'Registration failed. Please try again.',
    'register.passwordsNoMatch': 'Passwords do not match.',
    'register.passwordTooShort': 'Password must be at least 8 characters.',
    'register.emailAlreadyTaken': 'That email address has already been used. Please use a different email address.',
    'register.thanks': 'Thanks for registering! You will now be redirected to the login page. Please log in with your credentials.',
    'reset.default': 'An error occured with your reset request. Please try again.',
    'reset.cantFindEmail': 'A user with that email address could not be found.',
    'reset.requestSuccess': 'Your request was successful. Please check your email for a reset link.',
    'reset.success': 'Your password was properly reset and you should be logged in now.'
  });
})();
'use strict';

(function () {

  /*
   * Renders a standalone choice button.
   *
   * If the 'section' attribute is provided, the directive binds
   * a click to vm.selectSection(section); otherwise, the directive
   * binds a click to vm.moveTimeline(choice).
   *
   * The directive assumes that a SectionCtrl 'vm' is
   * accessible from the template.
   */

  angular.module('seventeendays').directive('choiceBtn', function () {
    return {
      templateUrl: 'app/templates/directives/choice-btn.html',
      replace: true,
      restrict: 'E',
      scope: true,
      link: function link(scope, element, attrs) {
        scope.choice = attrs.choice || false;
        scope.section = attrs.section || false;
        scope.linkClass = attrs.linkClass || 'openCog1';
        scope.btnClass = attrs.btnClass || 'choiceBtn';
        scope.overClass = '';
        scope.backgroundImg = attrs.background;

        attrs.$observe('choice', function (val) {
          return scope.choice = val || false;
        });
        attrs.$observe('section', function (val) {
          return scope.section = val || false;
        });
      }
    };
  });
})();
'use strict';

(function () {

  /*
   * Renders a choice menu with a standalone cog button.
   */

  angular.module('seventeendays').directive('choiceMenuCogBtn', function () {
    return {
      templateUrl: 'app/templates/directives/choice-menu-cog-btn.html',
      restrict: 'E',
      link: function link(scope, element, attrs) {
        scope.linkClass = attrs.linkClass || 'openCog1';
        scope.backgroundImg = attrs.background;
      }
    };
  });
})();
'use strict';

(function () {

  /*
   * Renders a choice menu.
   */

  angular.module('seventeendays').directive('choiceMenu', function () {
    return {
      templateUrl: 'app/templates/directives/choice-menu.html',
      transclude: true,
      restrict: 'E',
      link: function link(scope, element, attrs) {
        scope.backgroundImg = attrs.background;
      }
    };
  });
})();
'use strict';

(function () {

  /*
   * Renders the fixed menu button.
   */

  angular.module('seventeendays').directive('menuBtn', function () {
    return {
      templateUrl: 'app/templates/directives/menu-btn.html',
      restrict: 'E',
      replace: true,
      link: function link(scope, element, attrs) {
        scope.btnClass = attrs.btnClass || 'button';
        attrs.$observe('btnClass', function (val) {
          return scope.btnClass = val || 'button';
        });
      }
    };
  });
})();
'use strict';

(function () {

  /*
   * Renders the STI choice menu.
   */

  angular.module('seventeendays').directive('stiMenu', function () {
    return {
      templateUrl: 'app/templates/directives/sti-menu.html',
      transclude: true,
      restrict: 'E',
      link: function link(scope, element, attrs) {
        scope.choicePrefix = attrs.choicePrefix;
      }
    };
  });
})();
'use strict';

(function () {

  /*
   * Encapsulates behavior and declarative rendering of the
   * video player.
   */

  angular.module('seventeendays').directive('videoPlayer', function () {
    return {
      templateUrl: 'app/templates/directives/video-player.html',
      restrict: 'E',
      replace: true,
      link: function link(scope, element, attrs) {
        scope.config = {
          preload: "metadata",
          autoHide: true,
          autoHideTime: 3000,
          autoPlay: true,
          responsive: true,
          inline: true,
          theme: { url: "lib/videogular-themes-default/videogular.min.css" },
          plugins: {}
        };
      }
    };
  });
})();
'use strict';

(function () {

  /*
   * Manage application access.
   */

  angular.module('seventeendays').controller('AccessCtrl', ["$scope", "$state", "userSessionService", function ($scope, $state, userSessionService) {
    $scope.login = function () {
      return $state.go('app.login');
    };
    $scope.logout = function () {
      return $state.go('app.logout');
    };
    $scope.register = function () {
      return $state.go('app.register');
    };
  }]);
})();
'use strict';

(function () {

  /*
   * Manage user activation code entry.
   */

  angular.module('seventeendays').controller('ActivateCtrl', ["$scope", "$q", "$http", "$rootScope", "URLService", "userSessionService", "$state", function ($scope, $q, $http, $rootScope, URLService, userSessionService, $state) {

    var userSessionState = userSessionService.getCurrentState();

    $scope._user = userSessionService.getCurrentUser();

    $scope.register = function (activationCode) {
      return userSessionService.registerActivationCode(activationCode).catch(function (failure) {
        $scope.activationCodeInvalid = failure.exception;
      }).then(function () {
        return userSessionService.refreshUser();
      }).then(function (user) {
        $scope._user = user;
        var userSesh = userSessionService.getCurrentState();
        if (!$scope.activationCodeInvalid && userSessionService.userHasLicense(user)) {
          if ($rootScope.inLessons()) {
            return $state.go('app.lesson-code');
          } else {
            return $state.go('app.section', { key: 'open' });
          }
        }
      });
    };

    $scope.clearError = function () {
      delete $scope.activationCodeInvalid;
    };
  }]);
})();
'use strict';

(function () {

  /*
   * Provides user option to enter lesson access code.
   */

  angular.module('seventeendays').controller('LessonCodeCtrl', ["$scope", "$state", "$http", "$ionicPopup", "userSessionService", "URLService", "localStorageService", "surveyService", function ($scope, $state, $http, $ionicPopup, userSessionService, URLService, localStorageService, surveyService) {
    var currentUser = userSessionService.getCurrentUser();
    $scope.lesson = 'lesson';
    $scope.background = "pr_menu.png";

    // This checks to see if student is in the 'Seventeen Days' or 'Eat Smart' lesson curriculum
    if (currentUser.app_type && currentUser.app_type === "eat_smart") {
      $scope.lesson = 'eslesson';
      $scope.background = 'eat_smart_pr_menu.png';
    }

    $scope.startLesson = function (lessonNum) {
      localStorageService.set('Lesson', $scope.lesson + lessonNum);
      $state.go('app.lesson', { key: $scope.lesson + lessonNum });
    };
  }]);
})();
'use strict';

(function () {

  /*
   * Manage user login.
   */

  angular.module('seventeendays').controller('LoginCtrl', ["$scope", "$state", "$rootScope", "localStorageService", "surveyService", "messageService", "FRIENDLY_ERRORS", "$auth", "$ionicLoading", "authService", function ($scope, $state, $rootScope, localStorageService, surveyService, messageService, FRIENDLY_ERRORS, $auth, $ionicLoading, authService) {

    var emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

    $scope.creds = {};

    $scope.loginTo = function (provider) {

      $ionicLoading.show({ template: 'please wait...' });

      if (provider === 'default' && userInputIsBad()) {
        $ionicLoading.hide();
        return;
      }

      return loginMethod(provider).then(function (user) {
        //handled in raised event
      }, function (error) {
        if (error.reason && error.reason === "unauthorized") {
          messageService.broadcastError(FRIENDLY_ERRORS.getException('login.unauthorized'));
        } else {
          messageService.broadcastError(FRIENDLY_ERRORS.getException('login.default'));
        }
      }).then(function () {
        $ionicLoading.hide();
      });
    };

    var userInputIsBad = function userInputIsBad() {

      if (!$scope.creds.email || !$scope.creds.password) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('login.emailPasswordRequired'));
        return true;
      }

      if (!emailRegex.test($scope.creds.email)) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('login.emailIsInvalid'));
        return true;
      }

      return false;
    };

    var loginMethod = function loginMethod(provider) {
      if (provider === 'default') {
        return $auth.submitLogin($scope.creds);
      }
      // if (ionic.Platform.isWebView()) {
      //   return authService.login(provider);
      // } else {
      //   return $auth.authenticate(provider);
      // }
      return $auth.authenticate(provider);
    };
  }]);
})();
'use strict';

(function () {

  /*
   * Manage user logout.
   */

  angular.module('seventeendays').controller('LogoutCtrl', ["$state", "$auth", "userSessionService", function ($state, $auth, userSessionService) {
    return userSessionService.unload().then(function () {
      return $auth.signOut();
    });
  }]);
})();
'use strict';

(function () {

  /*
   * Manages interactions with menu.
   */

  angular.module('seventeendays').controller('MainCtrl', ["$scope", "$state", "$auth", "$rootScope", "localStorageService", "userSessionService", "ENDPOINTS", function ($scope, $state, $auth, $rootScope, localStorageService, userSessionService, ENDPOINTS) {
    $scope.register = function () {
      return $state.go('app.register');
    };
    $scope.goBack = function () {
      return $state.go('app.access');
    };
    $scope.login = function () {
      return $state.go('app.login');
    };
    $scope.logout = function () {
      return $state.go('app.logout');
    };
    $scope.preview = function () {
      return $state.go('app.preview');
    };
    $scope.resumeVideo = function () {
      var sesh = userSessionService.getCurrentState();
      $rootScope.resume = true;
      $state.go(sesh.state, sesh.params);
    };
  }]);
})();
'use strict';

(function () {

  /*
   * Provides user option to enter lesson access code.
   */

  angular.module('seventeendays').controller('MakeupLessonCodeCtrl', ["$scope", "$state", "$http", "$ionicPopup", "userSessionService", "URLService", "localStorageService", "surveyService", function ($scope, $state, $http, $ionicPopup, userSessionService, URLService, localStorageService, surveyService) {
    var currentUser = userSessionService.getCurrentUser();
    $scope.lesson = 'makeuplesson';
    $scope.makeupBackground = 'makeup_lesson_menu.png';

    // This checks to see if student is in the 'Seventeen Days' or 'Eat Smart' lesson curriculum
    if (currentUser.app_type && currentUser.app_type === "eat_smart") {
      $scope.lesson = 'makeupeslesson';
      $scope.makeupBackground = 'es_makeup_lesson_menu.png';
    }

    $scope.startMakeupLesson = function (lessonNum) {
      localStorageService.set('Lesson', $scope.lesson + lessonNum);
      $state.go('app.makeup-lesson', { key: $scope.lesson + lessonNum });
    };
  }]);
})();
'use strict';

(function () {

  /*
   * Manages DF messages.
   */

  angular.module('seventeendays').controller('MessageCtrl', ["$scope", function ($scope) {
    $scope.currentError = null;
    $scope.currentInfo = null;

    $scope.parseInfo = function (dataObj) {
      // create a place to store the error
      var message = null;

      // If the exception type is a string we don't need to go any further
      // This was thrown explicitly by the module due to a module error
      // unrelated to the server
      if (typeof dataObj === 'string') {

        // store the error
        // and we're done
        message = dataObj;

        // the exception is not a string
        // let's assume it came from the server
      } else {
          message = String(dataObj);
        }
      // return the built message to display to the user
      return message;
    };

    $scope.parseError = function (errorDataObj) {

      // create a place to store the error
      var error = null;

      // If the exception type is a string we don't need to go any further
      // This was thrown explicitly by the module due to a module error
      // unrelated to the server
      if (typeof errorDataObj.exception === 'string') {

        // store the error
        // and we're done
        error = errorDataObj.exception;

        // the exception is not a string
        // let's assume it came from the server
      } else {

          // is there more than one error contained in the object
          // I don't think I've ever encountered more than one message
          // in the error object but we should check
          if (errorDataObj.exception.data.error instanceof Array) {
            if (errorDataObj.exception.data.error.length > 1) {

              // yes. Let's loop through and concat these to display to the user
              angular.forEach(errorDataObj.exception.data.error, function (obj) {
                // add the message from each error obj to the error store
                error += obj.message + '\n';
              });

              // We have only one error message
              // 99.9% of the time this is the case
            } else {
                // store that error message
                error = errorDataObj.exception.data.error[0].message;
              }
          } else {
            if (errorDataObj.exception.data.error.context && errorDataObj.exception.data.error.context.email) {
              error = errorDataObj.exception.data.error.context.email[0];
            } else {
              error = errorDataObj.exception.data.error.message;
            }
          }
        }
      // return the built message to display to the user
      return error;
    };

    $scope.clearError = function () {
      $scope.currentError = null;
    };

    $scope.clearInfo = function () {
      $scope.currentInfo = null;
    };

    $scope.$on('error', function (e, errorMessageObj) {
      $scope.clearInfo();
      $scope.currentError = $scope.parseError(errorMessageObj);
    });

    $scope.$on('info', function (e, messageObj) {
      $scope.clearError();
      $scope.currentInfo = $scope.parseInfo(messageObj);
    });
  }]);
})();
'use strict';

(function () {

  /*
   * Manages navigation display.
   */

  angular.module('seventeendays').controller('NavigationCtrl', ["$scope", "$rootScope", "localStorageService", "userSessionService", "$state", function ($scope, $rootScope, localStorageService, userSessionService, $state) {
    $scope.hasJessicaRoom = localStorageService.get('jessica_room');
    $scope.$on('jessicaRoom', function (event) {
      return $scope.hasJessicaRoom = true;
    });
  }]);
})();
'use strict';

(function () {

  /*
   * Manage user password reset.
   */

  angular.module('seventeendays').controller('PasswordResetCtrl', ["$scope", "$rootScope", "messageService", "FRIENDLY_ERRORS", "$auth", "userSessionService", "$timeout", function ($scope, $rootScope, messageService, FRIENDLY_ERRORS, $auth, userSessionService, $timeout) {
    $scope.creds = {};

    $scope.verifyPassword = function (userDataObj) {
      $scope.identical = userDataObj.password === userDataObj.password_confirmation;
    };

    $scope.resetPassword = function (creds) {
      if ($scope.identical != true) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('register.passwordsNoMatch'));
        return;
      }
      if (creds.password.length < 8) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('register.passwordTooShort'));
        return;
      }
      $auth.updatePassword(creds).then(function (resp) {
        // handle success response
        messageService.broadcastMessage(FRIENDLY_ERRORS.getMessage('reset.success'));
        $timeout(function () {
          userSessionService.load(resp.data.data);
        }, 3000);
      }).catch(function (resp) {
        console.log("ERROR: ", resp);
        messageService.broadcastError(FRIENDLY_ERRORS.getException('reset.default'));
        // handle error response
      });
    };
  }]);
})();
'use strict';

(function () {

  /*
   * Manages app preview.
   */

  angular.module('seventeendays').controller('PreviewCtrl', ["$scope", "$rootScope", "$sce", "$ionicPopup", "WorkflowService", "localStorageService", "userSessionService", "$state", function ($scope, $rootScope, $sce, $ionicPopup, WorkflowService, localStorageService, userSessionService, $state) {
    var vm = this;
    vm.onPlayerReady = WorkflowService.setVideoAPI;
    vm.videoSources = [{ src: $sce.trustAsResourceUrl("https://s3-us-west-2.amazonaws.com/seventeendays/Open/open1.mp4"), type: "video/mp4" }];
    vm.onCompleteVideo = function () {
      $ionicPopup.alert({
        title: 'Preview Complete',
        template: "You have finished your preview. Please click 'OK' to return to the main page."
      }).then(function () {
        $state.go('app.access');
      });
    };
  }]);
})();
'use strict';

(function () {

  /*
   * Manage registration interactions.
   */

  angular.module('seventeendays').controller('RegisterCtrl', ["$scope", "$state", "$rootScope", "$timeout", "FRIENDLY_ERRORS", "messageService", "$auth", function ($scope, $state, $rootScope, $timeout, FRIENDLY_ERRORS, messageService, $auth) {

    $scope.user = { activationCode: $state.params.activationCode };

    var emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

    $scope.verifyPassword = function (userDataObj) {
      $scope.identical = userDataObj.new_password === userDataObj.verify_password;
    };

    $scope.register = function (user) {
      console.log('register called');
      if (!user || !user.email || !user.new_password) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('login.emailPasswordRequired'));
        return;
      }
      if (!emailRegex.test(user.email)) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('login.emailIsInvalid'));
        return;
      }
      if ($scope.identical != true) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('register.passwordsNoMatch'));
        return;
      }
      if (user.new_password.length < 8) {
        messageService.broadcastError(FRIENDLY_ERRORS.getException('register.passwordTooShort'));
        return;
      }

      var credentials = { email: user.email, password: user.new_password, password_confirmation: user.verify_password, activationCode: user.activationCode };

      return $auth.submitRegistration(credentials).then(function (user) {
        messageService.broadcastMessage(FRIENDLY_ERRORS.getMessage('register.thanks'));
        $timeout(function () {}, 5000).then(function () {
          $state.go('app.login');
        });
      }, function (error) {
        if (error.status === 422) {
          messageService.broadcastError(FRIENDLY_ERRORS.getException('register.emailAlreadyTaken'));
        } else {
          messageService.broadcastError(FRIENDLY_ERRORS.getException('register.default'));
        }
      });
    };
  }]);
})();
'use strict';

(function () {

  /*
   * Manage user password reset requests.
   */

  angular.module('seventeendays').controller('ResetRequestCtrl', ["$scope", "$rootScope", "$auth", "messageService", "FRIENDLY_ERRORS", function ($scope, $rootScope, $auth, messageService, FRIENDLY_ERRORS) {
    $scope.creds = {};

    $scope.requestPasswordReset = function (creds) {
      $auth.requestPasswordReset(creds).then(function (resp) {
        messageService.broadcastMessage(FRIENDLY_ERRORS.getMessage('reset.requestSuccess'));
      }).catch(function (resp) {
        if (resp.status === 404) {
          try {
            messageService.broadcastError({ exception: resp.data.errors[0] });
          } catch (z) {
            messageService.broadcastError(FRIENDLY_ERRORS.getException('reset.cantFindEmail'));
          }
        } else {
          messageService.broadcastError(FRIENDLY_ERRORS.getException('reset.default'));
        }
      });
    };
  }]);
})();
'use strict';

(function () {

  /*
   * Manages the workflow within a chosen section.
   */

  angular.module('seventeendays').controller('SectionCtrl', ["$scope", "$rootScope", "$stateParams", "$state", "WorkflowService", "surveyService", "TrackingService", "userSessionService", function ($scope, $rootScope, $stateParams, $state, WorkflowService, surveyService, TrackingService, userSessionService) {

    var vm = this;
    var currentUser = userSessionService.getCurrentUser();
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
    vm.onUpdateTime = function (currentTime, totalTime) {
      var roundedTime = Math.floor(currentTime);
      if (roundedTime % 5 === 0 && $scope.currentCheck !== roundedTime) {
        $scope.currentCheck = roundedTime;
        TrackingService.trackVideoProgress($rootScope.currentVideoFile, roundedTime, $rootScope.currentKey);
      }
    };

    // Get selection from user and move timeline.
    vm.moveTimeline = function (selected) {
      if (selected) {
        vm.positionInTime = WorkflowService.choosePath(selected);
      } else {
        vm.positionInTime = WorkflowService.advance();
      }
    };

    vm.selectSection = function (key) {
      return $state.go('app.section', { key: key });
    };
    vm.onCompleteVideo = function () {
      return vm.positionInTime = WorkflowService.advance();
    };
  }]);
})();
'use strict';

/**
 * An Angular module that gives you access to the browsers local storage
 * @version v0.1.4 - 2014-10-30
 * @link https://github.com/grevory/angular-local-storage
 * @author grevory <greg@gregpike.ca>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function (window, angular, undefined) {
  /*jshint globalstrict:true*/
  'use strict';

  var isDefined = angular.isDefined,
      isUndefined = angular.isUndefined,
      isNumber = angular.isNumber,
      isObject = angular.isObject,
      isArray = angular.isArray,
      extend = angular.extend,
      toJson = angular.toJson,
      fromJson = angular.fromJson;

  // Test if string is only contains numbers
  // e.g '1' => true, "'1'" => true
  function isStringNumber(num) {
    return (/^-?\d+\.?\d*$/.test(num.replace(/["']/g, ''))
    );
  }

  var angularLocalStorage = angular.module('LocalStorageModule', []);

  angularLocalStorage.provider('localStorageService', function () {

    // You should set a prefix to avoid overwriting any local storage variables from the rest of your app
    // e.g. localStorageServiceProvider.setPrefix('youAppName');
    // With provider you can use config as this:
    // myApp.config(function (localStorageServiceProvider) {
    //    localStorageServiceProvider.prefix = 'yourAppName';
    // });
    this.prefix = 'ls';

    // You could change web storage type localstorage or sessionStorage
    this.storageType = 'localStorage';

    // Cookie options (usually in case of fallback)
    // expiry = Number of days before cookies expire // 0 = Does not expire
    // path = The web path the cookie represents
    this.cookie = {
      expiry: 30,
      path: '/'
    };

    // Send signals for each of the following actions?
    this.notify = {
      setItem: true,
      removeItem: false
    };

    // Setter for the prefix
    this.setPrefix = function (prefix) {
      this.prefix = prefix;
    };

    // Setter for the storageType
    this.setStorageType = function (storageType) {
      this.storageType = storageType;
    };

    // Setter for cookie config
    this.setStorageCookie = function (exp, path) {
      this.cookie = {
        expiry: exp,
        path: path
      };
    };

    // Setter for cookie domain
    this.setStorageCookieDomain = function (domain) {
      this.cookie.domain = domain;
    };

    // Setter for notification config
    // itemSet & itemRemove should be booleans
    this.setNotify = function (itemSet, itemRemove) {
      this.notify = {
        setItem: itemSet,
        removeItem: itemRemove
      };
    };

    this.$get = ['$rootScope', '$window', '$document', '$parse', function ($rootScope, $window, $document, $parse) {
      var self = this;
      var prefix = self.prefix;
      var cookie = self.cookie;
      var notify = self.notify;
      var storageType = self.storageType;
      var webStorage;

      // When Angular's $document is not available
      if (!$document) {
        $document = document;
      } else if ($document[0]) {
        $document = $document[0];
      }

      // If there is a prefix set in the config lets use that with an appended period for readability
      if (prefix.substr(-1) !== '.') {
        prefix = !!prefix ? prefix + '.' : '';
      }
      var deriveQualifiedKey = function deriveQualifiedKey(key) {
        return prefix + key;
      };
      // Checks the browser to see if local storage is supported
      var browserSupportsLocalStorage = function () {
        try {
          var supported = storageType in $window && $window[storageType] !== null;

          // When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage
          // is available, but trying to call .setItem throws an exception.
          //
          // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage
          // that exceeded the quota."
          var key = deriveQualifiedKey('__' + Math.round(Math.random() * 1e7));
          if (supported) {
            webStorage = $window[storageType];
            webStorage.setItem(key, '');
            webStorage.removeItem(key);
          }

          return supported;
        } catch (e) {
          storageType = 'cookie';
          $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
          return false;
        }
      }();

      // Directly adds a value to local storage
      // If local storage is not available in the browser use cookies
      // Example use: localStorageService.add('library','angular');
      var addToLocalStorage = function addToLocalStorage(key, value) {
        // Let's convert undefined values to null to get the value consistent
        if (isUndefined(value)) {
          value = null;
        } else if (isObject(value) || isArray(value) || isNumber(+value || value)) {
          value = toJson(value);
        }

        // If this browser does not support local storage use cookies
        if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
          if (!browserSupportsLocalStorage) {
            $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
          }

          if (notify.setItem) {
            $rootScope.$broadcast('LocalStorageModule.notification.setitem', { key: key, newvalue: value, storageType: 'cookie' });
          }
          return addToCookies(key, value);
        }

        try {
          if (isObject(value) || isArray(value)) {
            value = toJson(value);
          }
          if (webStorage) {
            webStorage.setItem(deriveQualifiedKey(key), value);
          };
          if (notify.setItem) {
            $rootScope.$broadcast('LocalStorageModule.notification.setitem', { key: key, newvalue: value, storageType: self.storageType });
          }
        } catch (e) {
          $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
          return addToCookies(key, value);
        }
        return true;
      };

      // Directly get a value from local storage
      // Example use: localStorageService.get('library'); // returns 'angular'
      var getFromLocalStorage = function getFromLocalStorage(key) {

        if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
          if (!browserSupportsLocalStorage) {
            $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
          }

          return getFromCookies(key);
        }

        var item = webStorage ? webStorage.getItem(deriveQualifiedKey(key)) : null;
        // angular.toJson will convert null to 'null', so a proper conversion is needed
        // FIXME not a perfect solution, since a valid 'null' string can't be stored
        if (!item || item === 'null') {
          return null;
        }

        if (item.charAt(0) === "{" || item.charAt(0) === "[" || isStringNumber(item)) {
          return fromJson(item);
        }

        return item;
      };

      // Remove an item from local storage
      // Example use: localStorageService.remove('library'); // removes the key/value pair of library='angular'
      var removeFromLocalStorage = function removeFromLocalStorage(key) {
        if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
          if (!browserSupportsLocalStorage) {
            $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
          }

          if (notify.removeItem) {
            $rootScope.$broadcast('LocalStorageModule.notification.removeitem', { key: key, storageType: 'cookie' });
          }
          return removeFromCookies(key);
        }

        try {
          webStorage.removeItem(deriveQualifiedKey(key));
          if (notify.removeItem) {
            $rootScope.$broadcast('LocalStorageModule.notification.removeitem', { key: key, storageType: self.storageType });
          }
        } catch (e) {
          $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
          return removeFromCookies(key);
        }
        return true;
      };

      // Return array of keys for local storage
      // Example use: var keys = localStorageService.keys()
      var getKeysForLocalStorage = function getKeysForLocalStorage() {

        if (!browserSupportsLocalStorage) {
          $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
          return false;
        }

        var prefixLength = prefix.length;
        var keys = [];
        for (var key in webStorage) {
          // Only return keys that are for this app
          if (key.substr(0, prefixLength) === prefix) {
            try {
              keys.push(key.substr(prefixLength));
            } catch (e) {
              $rootScope.$broadcast('LocalStorageModule.notification.error', e.Description);
              return [];
            }
          }
        }
        return keys;
      };

      // Remove all data for this app from local storage
      // Also optionally takes a regular expression string and removes the matching key-value pairs
      // Example use: localStorageService.clearAll();
      // Should be used mostly for development purposes
      var clearAllFromLocalStorage = function clearAllFromLocalStorage(regularExpression) {

        regularExpression = regularExpression || "";
        //accounting for the '.' in the prefix when creating a regex
        var tempPrefix = prefix.slice(0, -1);
        var testRegex = new RegExp(tempPrefix + '.' + regularExpression);

        if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
          if (!browserSupportsLocalStorage) {
            $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
          }

          return clearAllFromCookies();
        }

        var prefixLength = prefix.length;

        for (var key in webStorage) {
          // Only remove items that are for this app and match the regular expression
          if (testRegex.test(key)) {
            try {
              removeFromLocalStorage(key.substr(prefixLength));
            } catch (e) {
              $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
              return clearAllFromCookies();
            }
          }
        }
        return true;
      };

      // Checks the browser to see if cookies are supported
      var browserSupportsCookies = function () {
        try {
          return $window.navigator.cookieEnabled || "cookie" in $document && ($document.cookie.length > 0 || ($document.cookie = "test").indexOf.call($document.cookie, "test") > -1);
        } catch (e) {
          $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
          return false;
        }
      }();

      // Directly adds a value to cookies
      // Typically used as a fallback is local storage is not available in the browser
      // Example use: localStorageService.cookie.add('library','angular');
      var addToCookies = function addToCookies(key, value) {

        if (isUndefined(value)) {
          return false;
        } else if (isArray(value) || isObject(value)) {
          value = toJson(value);
        }

        if (!browserSupportsCookies) {
          $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
          return false;
        }

        try {
          var expiry = '',
              expiryDate = new Date(),
              cookieDomain = '';

          if (value === null) {
            // Mark that the cookie has expired one day ago
            expiryDate.setTime(expiryDate.getTime() + -1 * 24 * 60 * 60 * 1000);
            expiry = "; expires=" + expiryDate.toGMTString();
            value = '';
          } else if (cookie.expiry !== 0) {
            expiryDate.setTime(expiryDate.getTime() + cookie.expiry * 24 * 60 * 60 * 1000);
            expiry = "; expires=" + expiryDate.toGMTString();
          }
          if (!!key) {
            var cookiePath = "; path=" + cookie.path;
            if (cookie.domain) {
              cookieDomain = "; domain=" + cookie.domain;
            }
            $document.cookie = deriveQualifiedKey(key) + "=" + encodeURIComponent(value) + expiry + cookiePath + cookieDomain;
          }
        } catch (e) {
          $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
          return false;
        }
        return true;
      };

      // Directly get a value from a cookie
      // Example use: localStorageService.cookie.get('library'); // returns 'angular'
      var getFromCookies = function getFromCookies(key) {
        if (!browserSupportsCookies) {
          $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
          return false;
        }

        var cookies = $document.cookie && $document.cookie.split(';') || [];
        for (var i = 0; i < cookies.length; i++) {
          var thisCookie = cookies[i];
          while (thisCookie.charAt(0) === ' ') {
            thisCookie = thisCookie.substring(1, thisCookie.length);
          }
          if (thisCookie.indexOf(deriveQualifiedKey(key) + '=') === 0) {
            var storedValues = decodeURIComponent(thisCookie.substring(prefix.length + key.length + 1, thisCookie.length));
            try {
              var obj = JSON.parse(storedValues);
              return fromJson(obj);
            } catch (e) {
              return storedValues;
            }
          }
        }
        return null;
      };

      var removeFromCookies = function removeFromCookies(key) {
        addToCookies(key, null);
      };

      var clearAllFromCookies = function clearAllFromCookies() {
        var thisCookie = null,
            thisKey = null;
        var prefixLength = prefix.length;
        var cookies = $document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          thisCookie = cookies[i];

          while (thisCookie.charAt(0) === ' ') {
            thisCookie = thisCookie.substring(1, thisCookie.length);
          }

          var key = thisCookie.substring(prefixLength, thisCookie.indexOf('='));
          removeFromCookies(key);
        }
      };

      var getStorageType = function getStorageType() {
        return storageType;
      };

      // Add a listener on scope variable to save its changes to local storage
      // Return a function which when called cancels binding
      var bindToScope = function bindToScope(scope, key, def, lsKey) {
        lsKey = lsKey || key;
        var value = getFromLocalStorage(lsKey);

        if (value === null && isDefined(def)) {
          value = def;
        } else if (isObject(value) && isObject(def)) {
          value = extend(def, value);
        }

        $parse(key).assign(scope, value);

        return scope.$watch(key, function (newVal) {
          addToLocalStorage(lsKey, newVal);
        }, isObject(scope[key]));
      };

      // Return localStorageService.length
      // ignore keys that not owned
      var lengthOfLocalStorage = function lengthOfLocalStorage() {
        var count = 0;
        var storage = $window[storageType];
        for (var i = 0; i < storage.length; i++) {
          if (storage.key(i).indexOf(prefix) === 0) {
            count++;
          }
        }
        return count;
      };

      return {
        isSupported: browserSupportsLocalStorage,
        getStorageType: getStorageType,
        set: addToLocalStorage,
        add: addToLocalStorage, //DEPRECATED
        get: getFromLocalStorage,
        keys: getKeysForLocalStorage,
        remove: removeFromLocalStorage,
        clearAll: clearAllFromLocalStorage,
        bind: bindToScope,
        deriveKey: deriveQualifiedKey,
        length: lengthOfLocalStorage,
        cookie: {
          isSupported: browserSupportsCookies,
          set: addToCookies,
          add: addToCookies, //DEPRECATED
          get: getFromCookies,
          remove: removeFromCookies,
          clearAll: clearAllFromCookies
        }
      };
    }];
  });
})(window, window.angular);
'use strict';

angular.module('seventeendays').service('authService', ['$http', '$stateParams', '$q', '$location', 'ENDPOINTS', '$window', '$auth', function ($http, $stateParams, $q, $location, ENDPOINTS, $window, $auth) {

  var _this = this;

  //stubUrl to get around angular url '#' check on the backend (via devise_token_auth)
  this.originUrl = $window.location.origin;

  this.login = function (provider) {
    console.log("IN LOGIN");
    var deferred = $q.defer();
    //open IAB window
    var authUrl = ENDPOINTS.API + '/auth/' + provider + '/?auth_origin_url=' + _this.originUrl;
    var browserWindow = $window.open(authUrl, '_blank', 'location=no');

    // listen for IAB window finish loading
    browserWindow.addEventListener("loadstop", function () {
      //grab linkedin authcode from url response
      getAuthCodeFromResponse(browserWindow).then(function (success) {
        deferred.resolve();
      }, function (err) {});
    });
    return deferred.promise;
  };

  // function called when the browser is closed
  function browserOnClose(output) {
    console.log("IN BROWSER ON CLOSE");
    //      get code from response url
    var code = output.url.toString(),
        authResponse = output.response[0],
        authResponseQueryString = authResponse.substr(authResponse.indexOf("#") + 1),
        clientIdRegex = /\?client_id=(.*)&amp;expiry/,
        expiryRegex = /expiry=(.*)&amp;token/,
        tokenRegex = /token=(.*)&amp;uid/,
        uidRegex = /uid=(.*)<\/p>/,
        clientId = authResponseQueryString.match(clientIdRegex)[1],
        expiry = authResponseQueryString.match(expiryRegex)[1],
        token = authResponseQueryString.match(tokenRegex)[1],
        uid = authResponseQueryString.match(uidRegex)[1],
        user = {
      client_id: clientId,
      expiry: expiry,
      auth_token: token,
      uid: uid
    };

    console.log(authResponseQueryString);
    $auth.initDfd();
    $auth.handleValidAuth(user, true);
  }

  function getAuthCodeFromResponse(browserWindow) {
    console.log("IN GET AUTH CODE FROM RESPONSE");
    var deferred = $q.defer();
    // we get the url everythime the page loads
    browserWindow.executeScript({ code: "document.URL" },

    //that url is passed to this function
    function (url) {
      var _url = url.toString();

      // we check if the callback page was reached
      if (_url.indexOf("callback") > -1 && _url.match(/(twitter|facebook|instagram)/)) {
        // the callback page was reached therefore it contains the json output returned from the server
        // we parse the html page to strip out the html tags and keep the json string
        browserWindow.executeScript({ code: "document.body.innerHTML" }, function (response) {
          browserWindow.close();
          // we close the window and call this function with the url and the json output
          browserOnClose({ url: url, response: response });
          deferred.resolve();
        });
      }
    });
    return deferred.promise;
  }
}]);
'use strict';

(function () {

  /*
   * Provides access to the application data.
   */

  angular.module('seventeendays').factory('DataService', ["DATA", function (DATA) {
    /*
     * Fetch data for a particular path.
     */
    function getPathData(pathName) {
      return DATA.paths[pathName];
    }

    /*
     * Fetch data for a particular step.
     */
    function getStepData(stepName) {
      return DATA.steps[stepName];
    }

    return {
      getPathData: getPathData,
      getStepData: getStepData
    };
  }]);
})();
'use strict';

(function () {

  /*
   * Provides access to app message/error functions.
   */

  angular.module('seventeendays').factory('messageService', ["$rootScope", "$ionicPopup", function ($rootScope, $ionicPopup) {
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
      broadcastMessage: broadcastMessage,
      broadcastError: broadcastError,
      loginPopup: loginPopup
    };
  }]);
})();
'use strict';

(function () {

  /*
   * Provides access to the survey data and display.
   */

  angular.module('seventeendays').service('surveyService', ["$state", "$auth", "$rootScope", "$ionicModal", "localStorageService", "$http", "$timeout", "URLService", "$q", "DATA", function ($state, $auth, $rootScope, $ionicModal, localStorageService, $http, $timeout, URLService, $q, DATA) {

    var self = this;
    var $scope = $rootScope.$new();
    $scope.responses = {};
    $scope.buttonText = "Submit";
    $scope.buttonType = "button-positive";

    this.checkSurveyPositions = function (position) {
      angular.forEach($rootScope.surveys, function (survey) {
        if (survey.position === position) {
          displaySurveyModal(survey);
        }
      });
    };

    this.setActiveSurveys = function (user) {
      angular.forEach(user.surveys, function (survey) {
        if (~user.active_survey_ids.indexOf(survey.id) && ! ~$rootScope.surveys.indexOf(survey)) {
          $rootScope.surveys.push(survey);
        }
      });
    };

    var checkResponses = function checkResponses(responses) {
      var check = true;
      angular.forEach(responses, function (value, key) {
        if (value.answer_id === null) {
          check = false;
        }
      });
      if (!check) {
        setErrorButton();
      };
      return check;
    };

    $scope.submitSurveyResponses = function (responses) {
      if (checkResponses(responses)) {
        var data = { responses: responses };
        var defer = $q.defer();
        $http({
          method: 'POST',
          url: '' + URLService.getResponseURL(),
          data: data
        }).then(function (data) {
          defer.resolve();
        }, function (error) {
          defer.reject(error.data);
        });
        setSuccessButton();
        return defer.promise;
      }
    };

    var displaySurveyModal = function displaySurveyModal(survey) {
      $scope.data = {};
      $scope.survey = survey;
      setResponsesObject(survey);
      $ionicModal.fromTemplateUrl('views/survey.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
        return modal;
      });
    };

    var setResponsesObject = function setResponsesObject(survey) {
      var currentUser = $rootScope.getCurrentUser();
      for (var i = 0; survey.questions.length > i; i++) {
        var response = { user_id: currentUser.id, survey_id: survey.id, answer_id: null };
        $scope.responses[survey.questions[i].id] = response;
      }
    };

    var setErrorButton = function setErrorButton() {
      $scope.buttonText = "Please answer all questions...";
      $scope.buttonType = "button-assertive";
    };

    var setSuccessButton = function setSuccessButton() {
      $scope.buttonText = "Thanks!";
      $scope.buttonType = "button-balanced";
      $timeout(function () {}, 3000).then(function () {
        $scope.modal.hide();
      });
    };
  }]);
})();
'use strict';

(function () {

  /*
   * Tracks the progress of the user throughout the
   * application workflows.
   */

  angular.module('seventeendays').service('TrackingService', ["$rootScope", "$state", "$http", "$timeout", "$ionicPopup", "userSessionService", "DataService", "URLService", "localStorageService", "surveyService", function ($rootScope, $state, $http, $timeout, $ionicPopup, userSessionService, DataService, URLService, localStorageService, surveyService) {

    function lessonCompletePopup() {
      var alertPopup = $ionicPopup.alert({
        title: 'Lesson Complete',
        template: "You have finished your lesson. Please click 'OK' to return to the lesson selection page."
      });

      alertPopup.then(function () {
        $state.go('app.lesson-code');
        surveyService.checkSurveyPositions(3);
      });
    };

    /*
     * Track a path selection.
     */
    function trackPath(path) {
      var currentUser = userSessionService.getCurrentUser();
      var data = {
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
      var currentUser = userSessionService.getCurrentUser();
      var data = {
        thisaction: 'increment',
        user: currentUser.email
      };

      var stepData = DataService.getStepData(step);
      data = Object.assign({}, data, stepData);
      postViewLogData(data);
    }

    function trackVideoProgress(fileName, time, key) {
      var videoData = { current_file: fileName, current_file_time: time, current_key: key };
      userSessionService.updateVideoProgress(videoData);
    }

    function postViewLogData(data) {
      if (data.marker) {
        $http({
          method: 'POST',
          url: URLService.getViewLogsURL(),
          data: data
        });
      }
    }

    function countdown(time) {
      var timeLeft = time;
      $rootScope.timer = $timeout(function () {
        timeLeft--;
        if (timeLeft <= 0 && $rootScope.videoComplete) {
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
  }]);
})();
'use strict';

(function () {

  /*
   * Generates environment-specific endpoint URLs.
   */

  angular.module('seventeendays').factory('URLService', ["ENDPOINTS", function (ENDPOINTS) {
    function isProduction() {
      return ENDPOINTS.environment === 'production';
    }

    function getViewLogsURL() {
      return ENDPOINTS.API + ENDPOINTS.VIEWER_LOGS;
    }

    function getUserUrl(userId) {
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

    function getActivationCodeURL() {
      return ENDPOINTS.API + ENDPOINTS.ACTIVATION_CODE;
    }

    function getQueryActivationCodeURL() {
      var by = arguments.length <= 0 || arguments[0] === undefined ? 'code' : arguments[0];

      return getActivationCodeURL() + ('/show?' + by + '=');
    }

    function getResponseURL() {
      return ENDPOINTS.API + ENDPOINTS.RESPONSE;
    }

    return {
      isProduction: isProduction,
      getViewLogsURL: getViewLogsURL,
      getRegisterURL: getRegisterURL,
      getLoginURL: getLoginURL,
      getLessonURL: getLessonURL,
      getUserUrl: getUserUrl,
      getQueryActivationCodeURL: getQueryActivationCodeURL,
      getQueryActivationCodeUrlForField: getQueryActivationCodeURL,
      getActivationCodeURL: getActivationCodeURL,
      getResponseURL: getResponseURL
    };
  }]);
})();
// (function() {

//   /*
//    * Provides access to activation data.
//    */

//   angular.module('seventeendays').service('UserActivityService',
//     function($timeout, $document, $ionicModal, $rootScope, WorkflowService, $state){

//       let timeOfLastAction = undefined;
//       let inactivityLogoutPromise = undefined;
//       let userStatusPromise = undefined;
//       let modalInstance = undefined;
//       const TTL = 5000;
//       const UPDATE_INTERVAL = 5000;
//       var self = this;

//       this.registerEvents = function(){

//         $document.off();

//         var eventsToObserve = [
//           'mousemove','click','touchstart', 'touchend', 'touchmove', 'touchcancel',
//           'blur','focus','focusin','focusout','load','resize','scroll','unload','click','dblclick',
//           'mousedown','mouseup','mousemove','mouseover','mouseout','mouseenter','mouseleave',
//           'change','select','submit','keydown','keypress','keyup','error','contextmenu'
//         ];

//         for(var i =0;i<eventsToObserve.length;i++){
//           $document.on(eventsToObserve[i],()=>{
//             timeOfLastAction = new Date();
//             _handleUserInactivity();
//           });
//         }

//         _handleUserInactivity();
//       }

//       this.trackUserActivity = function(){
//         $timeout.cancel(userStatusPromise);
//         userStatusPromise = $timeout(()=>{
//           _updateUserStatus();
//         }, UPDATE_INTERVAL);
//       }

//       function _updateUserStatus(){
//         console.log('!!!updating user status!!!!');
//         self.trackUserActivity();
//       }

//       function _handleUserInactivity(){
//         $timeout.cancel(inactivityLogoutPromise);
//         inactivityLogoutPromise = $timeout(()=>{
//           _getModalResult();
//         }, TTL);

//       }

//       function _getModalResult(){

//         if (modalInstance) return;

//         let scope = $rootScope.$new();
//         scope.TTL = TTL;

//         scope.$on('modal.removed', function() {
//           _handleUserInactivity();
//         });

//         scope.stop = function(){
//           modalInstance.hide();
//           modalInstance.remove();
//           modalInstance = undefined;
//           WorkflowService.getVideoAPI().stop();

//         };

//         scope.continue = function(){
//           //todo: resume video-->
//           modalInstance.hide();
//           modalInstance.remove();
//           modalInstance = undefined;
//           // WorkflowService.getVideoAPI().play();
//         }

//         return $ionicModal.fromTemplateUrl('views/inactivity-modal.html', {
//           scope: scope,
//           animation: 'slide-in-up'
//         }).then(function(modal) {
//           modalInstance = modal;
//           WorkflowService.getVideoAPI().pause();
//           return modalInstance.show();
//         });
//       }

//   });

// })()
"use strict";
'use strict';

(function () {

  /*
   * Provides access to the application data.
   */

  angular.module('seventeendays').service('userSessionService', ["$state", "$auth", "$rootScope", "localStorageService", "$http", "URLService", "surveyService", "$q", "DATA", function ($state, $auth, $rootScope, localStorageService, $http, URLService, surveyService, $q, DATA) {

    var self = this;
    this.getCurrentUser = function () {
      return $rootScope.getCurrentUser();
    };

    this.refreshUser = function () {
      var defer = $q.defer();
      $http.get(URLService.getUserUrl(self.getCurrentUser().id)).then(function (resp) {
        $rootScope.user = resp.data;
        return defer.resolve(self.getCurrentUser());
      });
      return defer.promise;
    };

    this.registerActivationCode = function (activationCode) {
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: '' + URLService.getActivationCodeURL(),
        data: { code: activationCode, user_id: self.getCurrentUser().id }
      }).then(function (response) {
        defer.resolve(response.data);
      }, function (error) {
        defer.reject(error.data);
      });
      return defer.promise;
    };

    this.getCurrentState = function () {
      var appPosition = self.getPosition();
      if (appPosition) {
        var sectionKeys = Object.keys(DATA.paths);
        for (var i = 0, l = sectionKeys.length; i < l; i++) {
          if (~appPosition.indexOf(sectionKeys[i])) {
            if (~appPosition.indexOf('makeup')) {
              return { state: 'app.makeup-lesson', params: { key: appPosition } };
            } else if (~appPosition.indexOf('lesson')) {
              return { state: 'app.lesson', params: { key: appPosition } };
            } else {
              return { state: 'app.section', params: { key: sectionKeys[i] } };
            }
          }
        }
      }
      return { state: 'app.section', params: { key: 'open' } };
    };

    this.updatePosition = function (position) {
      var updateObj = { position: position };
      if (position === 'jessica' && !$rootScope.user.jessicas_room) {
        updateObj.jessicas_room = true;
      }
      $auth.updateAccount(updateObj).then(function (resp) {
        $rootScope.user = resp.data.data;
      }).catch(function (resp) {
        console.log("ERROR: User position could not be updated.");
      });
    };

    this.getPosition = function () {
      if ($rootScope.hasCurrentUser()) {
        return $rootScope.user.position;
      }
    };

    this.updateVideoProgress = function (data) {
      if (data.current_file && data.current_file_time && data.current_key) {
        $auth.updateAccount(data).then(function (resp) {
          $rootScope.user = resp.data.data;
        }).catch(function (resp) {
          console.log("ERROR: User video progress could not be updated.");
        });
      }
    };

    /*
     * Sign a user in.
     */
    this.load = function (user) {
      self.repairPostionErrors(user);
      $rootScope.user = user;
      surveyService.setActiveSurveys(user);
      surveyService.checkSurveyPositions(1);
      if (user.current_key) {
        $rootScope.currentKey = user.current_key;
      }
      if (self.userHasLicense(user)) {
        if ($rootScope.inLessons()) {
          return $state.go('app.lesson-code');
        } else {
          var userSesh = self.getCurrentState();
          return $state.go(userSesh.state, userSesh.params);
        }
      } else {
        return $state.go('app.section', { key: 'openpreview' });
      }
    };

    this.repairPostionErrors = function (user) {
      if (user.app_type === 'seventeen_days' && user.position) {
        if (user.position.indexOf('lesson') > -1) {
          user.position = 'open';
        }
      }
    };

    // This will check if the user logging in has a valid license
    // Set this to return false if you want to test the preview mode
    this.userHasLicense = function (user) {
      var result = false;
      if (user.activation_codes.length > 0) {
        for (var i = 0; i < user.activation_codes.length; i++) {
          if (!user.activation_codes[i].expired) {
            result = true;
            break;
          }
        }
      }
      return result;
    };

    /*
     * Sign a user out.
     */
    this.unload = function () {
      localStorageService.remove('Lesson');
      localStorageService.remove('auth_headers');
      $rootScope.surveys = [];
      $rootScope.videoComplete = true;
      delete $rootScope.user;
      return $state.go('app.access');
    };
  }]);
})();
'use strict';

(function () {

  /*
   * Manages the state of the application in relation to the
   * storyline.
   */

  angular.module('seventeendays').factory('WorkflowService', ["$state", "$timeout", "$ionicPopup", "$rootScope", "DataService", "TrackingService", "localStorageService", "userSessionService", "surveyService", function ($state, $timeout, $ionicPopup, $rootScope, DataService, TrackingService, localStorageService, userSessionService, surveyService) {
    var viewModel = void 0;
    var sectionKey = void 0;
    var sectionPaths = void 0;
    var currentPath = void 0;
    var currentStepIndex = void 0;
    var videoAPI = {};

    /* Utility functions
      ------------------------------------ */
    function currentStep() {
      return currentPath.steps[currentStepIndex];
    }

    function stepIsVideo(step) {
      if (step.indexOf('.mp4') > -1) {
        $rootScope.videoComplete = false;
        return true;
      } else {
        $rootScope.videoComplete = true;
        return false;
      }
    }

    function constructVideoSource(step) {
      $rootScope.currentVideoFile = step;
      var videoBase = 'http://dh5ycesfech6i.cloudfront.net';
      var personKeys = ['eva', 'hailey', 'isabel', 'lauren', 'maya', 'nicki', 'jessica'];
      var openKeys = ['open4noquit.mp4', 'open2.mp4', 'open3.mp4'];
      var jessicaKeys = ['kyb.mp4', 'bcintro.mp4', 'gynecog1.mp4', 'gynecog2.mp4', 'condoms.mp4'];
      var localLesson = localStorageService.get('Lesson');
      var videoSubdir = void 0;

      if (~personKeys.indexOf(sectionKey)) {
        videoSubdir = sectionKey[0].toUpperCase() + sectionKey.slice(1);
      } else if (sectionKey.match(/^sti/)) {
        videoSubdir = 'STIs';
      } else if (sectionKey === 'birthcontrol') {
        videoSubdir = 'Jessica';
      } else if (sectionKey === 'kyb') {
        videoSubdir = 'know_your_body';
      } else if (~sectionKey.indexOf('open') || sectionKey === 'close') {
        videoSubdir = 'Open';
      } else if (~localLesson.indexOf('lesson')) {
        if (~jessicaKeys.indexOf(step)) {
          videoSubdir = 'Jessica';
        } else if (~openKeys.indexOf(step)) {
          videoSubdir = 'Open';
        } else if (localLesson.charAt(0) == 'e' || ~localLesson.indexOf('makeupes')) {
          videoSubdir = 'eat_smart';
        } else {
          videoSubdir = 'lessons';
        }
      } else {
        throw 'Invalid section key! ' + sectionKey;
      }

      return {
        src: videoBase + '/' + videoSubdir + '/' + step,
        type: 'video/mp4'
      };
    }

    function addVideoSource(step) {
      viewModel.videoSources = [constructVideoSource(step)];
    }

    // startTime is number of seconds into the video you want it to start
    function playFromPoint(step, startTime) {
      viewModel.videoSources = [constructVideoSource(step)];
      if (videoAPI.isReady) {
        $timeout(function () {
          return videoAPI.seekTime(startTime);
        }, 0);
      }
    }

    function positionInTime(step) {
      return {
        type: stepIsVideo(step) ? 'mp4' : 'html',
        value: step
      };
    }
    /* ------------------------------------ */

    /*
     * Handle a user's path choice within an app section.
     */
    function choosePath(key) {
      $rootScope.currentKey = key;
      var step = "";
      currentPath = sectionPaths[key];
      currentStepIndex = 0;
      var user = userSessionService.getCurrentUser();
      if (!$rootScope.resume) {
        if (currentPath) {
          step = currentStep();
          TrackingService.trackPath(currentPath);

          if (stepIsVideo(step)) {
            addVideoSource(step);
          }
        }
      } else {
        if (user.position !== 'bonfire') {
          if (user.position.indexOf('lesson') > -1) {
            localStorageService.set('Lesson', user.position);
          }
          if (currentPath.steps.indexOf(user.current_file) > -1) {
            step = user.current_file;
            TrackingService.trackPath(currentPath);
            if (stepIsVideo(step)) {
              playFromPoint(step, user.current_file_time);
            }
          } else {
            step = currentStep();
            TrackingService.trackPath(currentPath);
            if (stepIsVideo(step)) {
              addVideoSource(step);
            }
          }
        } else {
          $state.go('app.section', { key: 'bonfire' });
        }
        $rootScope.resume = false;
      }

      return positionInTime(step);
    }

    /*
     * Advance in or from the chosen navigation path.
     */
    function advance() {
      var step = void 0;
      // Altering this variable for lesson interactivity countdown timer

      if (currentStepIndex < currentPath.steps.length - 1) {
        currentStepIndex += 1;
        step = currentStep();
        TrackingService.trackStep(step);

        if (stepIsVideo(step)) {
          // Smelly fix for starting specific videos in makeup lessons at points
          if (currentPath.label.indexOf("Lesson 1") > -1 && step === "open4noquit.mp4") {
            playFromPoint(step, 10);
          } else if (currentPath.label.indexOf("Lesson 4") > -1 && step === "open2.mp4") {
            playFromPoint(step, 680);
          } else {
            addVideoSource(step);
          }
        }

        return positionInTime(step);
      } else {
        if (currentPath.redirect) {
          // Starts a lesson interactivity countdown timer if necessary
          if (currentPath.lessonEnd) {
            TrackingService.countdown(currentPath.countdownTime);
          }
          // If there is a redirect, go there
          if (currentPath.redirectView) {
            $state.go('app.section', { key: currentPath.redirect });
          } else {
            return choosePath(currentPath.redirect);
          }
        } else {
          // Check to see if user is in a lesson
          if (localStorageService.get('Lesson')) {
            var lessonPosition = localStorageService.get('Lesson');
            // If it's the end of the lesson, show the lesson complete popup & return to lesson-code page
            if (currentPath.lessonEnd) {
              TrackingService.lessonCompletePopup();
            } else {
              // otherwise go to the particular lesson's end path
              var toState = 'app.lesson';
              if (~lessonPosition.indexOf('makeup')) {
                toState = 'app.makeup-lesson';
              }
              $state.go(toState, { key: lessonPosition + 'close' });
            }
          } else {
            // If the user doesn't have an activation code, end their session
            if (currentPath.label === "Preview") {
              previewPopup();
            } else {
              // If there is no redirect, and user isn't in a lesson, move to the original ending of the app
              $state.go('app.section', { key: 'close' });
            }
          }
        }
      }
    }

    /*
     * Set section related stores.
     */
    function chooseSection(key, vm) {
      viewModel = vm;
      sectionKey = key;
      sectionPaths = DataService.getPathData(key);
      userSessionService.updatePosition(key);
    }

    function previewPopup() {
      $ionicPopup.alert({
        title: 'Preview Complete',
        template: "You have finished your preview. Please click 'OK' to continue to account activation or you can rewatch the preview via the 'Return to Preview' button in the menu sidebar."
      }).then(function () {
        $state.go('app.activate');
      });
    }

    /*
     * Set the video API.
     */
    function setVideoAPI(api) {
      videoAPI = api;
    }

    return {
      choosePath: choosePath,
      advance: advance,
      chooseSection: chooseSection,
      setVideoAPI: setVideoAPI,
      currentStep: currentStep
    };
  }]);
})();
/**
 * @license videogular v1.4.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgControls
 * @restrict E
 * @description
 * This directive acts as a container and you will need other directives to control the media.
 * Inside this directive you can add other directives like vg-play-pause-button and vg-scrub-bar.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'></vg-controls>
 * </videogular>
 * </pre>
 *
 * @param {boolean=false} vgAutohide Boolean variable or value to activate autohide.
 * @param {number=2000} vgAutohideTime Number variable or value that represents the time in milliseconds that will wait vgControls until it hides.
 *
 *
 */
"use strict";

angular.module("com.2fdevs.videogular.plugins.controls", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("vg-templates/vg-controls", '<div class="controls-container" ng-mousemove="onMouseMove()" ng-class="animationClass" ng-transclude></div>');
}]).directive("vgControls", ["$timeout", "VG_STATES", function ($timeout, VG_STATES) {
    return {
        restrict: "E",
        require: "^videogular",
        transclude: true,
        templateUrl: function templateUrl(elem, attrs) {
            return attrs.vgTemplate || 'vg-templates/vg-controls';
        },
        scope: {
            vgAutohide: "=?",
            vgAutohideTime: "=?"
        },
        link: function link(scope, elem, attr, API) {
            var w = 0;
            var h = 0;
            var autoHideTime = 2000;
            var hideInterval;

            scope.API = API;

            scope.onMouseMove = function onMouseMove() {
                if (scope.vgAutohide) scope.showControls();
            };

            scope.setAutohide = function setAutohide(value) {
                if (value && API.currentState == VG_STATES.PLAY) {
                    hideInterval = $timeout(scope.hideControls, autoHideTime);
                } else {
                    scope.animationClass = "";
                    $timeout.cancel(hideInterval);
                    scope.showControls();
                }
            };

            scope.setAutohideTime = function setAutohideTime(value) {
                autoHideTime = value;
            };

            scope.hideControls = function hideControls() {
                scope.animationClass = "hide-animation";
            };

            scope.showControls = function showControls() {
                scope.animationClass = "show-animation";
                $timeout.cancel(hideInterval);
                if (scope.vgAutohide && API.currentState == VG_STATES.PLAY) hideInterval = $timeout(scope.hideControls, autoHideTime);
            };

            scope.$watch(function () {
                return API.currentState;
            }, function (newVal, oldVal) {
                if (newVal === 'pause') {
                    scope.showControls();
                } else {
                    scope.hideControls();
                }
            });

            if (API.isConfig) {
                scope.$watch("API.config", function () {
                    if (scope.API.config) {
                        var ahValue = scope.API.config.plugins.controls.autohide || false;
                        var ahtValue = scope.API.config.plugins.controls.autohideTime || 2000;
                        scope.vgAutohide = ahValue;
                        scope.vgAutohideTime = ahtValue;
                        scope.setAutohideTime(ahtValue);
                        scope.setAutohide(ahValue);
                    }
                });
            } else {
                // If vg-autohide has been set
                if (scope.vgAutohide != undefined) {
                    scope.$watch("vgAutohide", scope.setAutohide);
                }

                // If vg-autohide-time has been set
                if (scope.vgAutohideTime != undefined) {
                    scope.$watch("vgAutohideTime", scope.setAutohideTime);
                }
            }
        }
    };
}]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgFullscreenButton
 * @restrict E
 * @description
 * Directive to switch between fullscreen and normal mode.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-fullscreen-button></vg-fullscreen-button>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls").run(["$templateCache", function ($templateCache) {
    $templateCache.put("vg-templates/vg-fullscreen-button", '<button class="iconButton" ng-click="onClickFullScreen()" ng-class="fullscreenIcon" aria-label="Toggle full screen" type="button"> </button>');
}]).directive("vgFullscreenButton", [function () {
    return {
        restrict: "E",
        require: "^videogular",
        scope: {},
        templateUrl: function templateUrl(elem, attrs) {
            return attrs.vgTemplate || 'vg-templates/vg-fullscreen-button';
        },
        link: function link(scope, elem, attr, API) {
            scope.onChangeFullScreen = function onChangeFullScreen(isFullScreen) {
                scope.fullscreenIcon = { enter: !isFullScreen, exit: isFullScreen };
            };

            scope.onClickFullScreen = function onClickFullScreen() {
                API.toggleFullScreen();
            };

            scope.fullscreenIcon = { enter: true };

            scope.$watch(function () {
                return API.isFullScreen;
            }, function (newVal, oldVal) {
                if (newVal != oldVal) {
                    scope.onChangeFullScreen(newVal);
                }
            });
        }
    };
}]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgPlayPauseButton
 * @restrict E
 * @description
 * Adds a button inside vg-controls to play and pause media.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-play-pause-button></vg-play-pause-button>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls").run(["$templateCache", function ($templateCache) {
    $templateCache.put("vg-templates/vg-play-pause-button", '<button class="iconButton" ng-click="onClickPlayPause()" ng-class="playPauseIcon" aria-label="Play/Pause" type="button"></button>');
}]).directive("vgPlayPauseButton", ["VG_STATES", function (VG_STATES) {
    return {
        restrict: "E",
        require: "^videogular",
        scope: {},
        templateUrl: function templateUrl(elem, attrs) {
            return attrs.vgTemplate || 'vg-templates/vg-play-pause-button';
        },
        link: function link(scope, elem, attr, API) {
            scope.setState = function setState(newState) {
                switch (newState) {
                    case VG_STATES.PLAY:
                        scope.playPauseIcon = { pause: true };
                        break;

                    case VG_STATES.PAUSE:
                        scope.playPauseIcon = { play: true };
                        break;

                    case VG_STATES.STOP:
                        scope.playPauseIcon = { play: true };
                        break;
                }
            };

            scope.onClickPlayPause = function onClickPlayPause() {
                API.playPause();
            };

            scope.playPauseIcon = { play: true };

            scope.$watch(function () {
                return API.currentState;
            }, function (newVal, oldVal) {
                scope.setState(newVal);
            });
        }
    };
}]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:ngPlaybackButton
 * @restrict E
 * @description
 * Directive to display a playback buttom to control the playback rate.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-playback-button></vg-playback-button>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls").run(["$templateCache", function ($templateCache) {
    $templateCache.put("vg-templates/vg-playback-button", '<button class="playbackValue iconButton" ng-click="onClickPlayback()">{{playback}}x</button>');
}]).directive("vgPlaybackButton", [function () {
    return {
        restrict: "E",
        require: "^videogular",
        templateUrl: function templateUrl(elem, attrs) {
            return attrs.vgTemplate || 'vg-templates/vg-playback-button';
        },
        link: function link(scope, elem, attr, API) {
            scope.playback = '1';

            scope.setPlayback = function (playback) {
                scope.playback = playback;
                API.setPlayback(parseFloat(playback));
            };

            scope.onClickPlayback = function onClickPlayback() {
                var playbackOptions = ['0.5', '1', '1.5', '2'];
                var nextPlaybackRate = playbackOptions.indexOf(scope.playback.toString()) + 1;

                if (nextPlaybackRate >= playbackOptions.length) {
                    scope.playback = playbackOptions[0];
                } else {
                    scope.playback = playbackOptions[nextPlaybackRate];
                }

                scope.setPlayback(scope.playback);
            };

            scope.$watch(function () {
                return API.playback;
            }, function (newVal, oldVal) {
                if (newVal != oldVal) {
                    scope.setPlayback(newVal);
                }
            });
        }
    };
}]);
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBarBuffer
 * @restrict E
 * @description
 * Layer inside vg-scrub-bar to display the buffer.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-scrub-bar>
 *            <vg-scrub-bar-buffer></vg-scrub-bar-buffer>
 *        </vg-scrub-bar>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls").directive("vgScrubBarBuffer", [function () {
    return {
        restrict: "E",
        require: "^videogular",
        link: function link(scope, elem, attr, API) {
            var percentTime = 0;

            scope.onUpdateBuffer = function onUpdateBuffer(newBuffer) {
                if (typeof newBuffer === 'number' && API.totalTime) {
                    percentTime = 100 * (newBuffer / API.totalTime);
                    elem.css("width", percentTime + "%");
                } else {
                    elem.css("width", 0);
                }
            };

            scope.$watch(function () {
                return API.bufferEnd;
            }, function (newVal, oldVal) {
                scope.onUpdateBuffer(newVal);
            });
        }
    };
}]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBarCuePoints
 * @restrict E
 * @description
 * Layer inside vg-scrub-bar to display a cue point timeline.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls>
 *        <vg-scrub-bar>
 *            <vg-scrub-bar-cue-points vg-cue-points='config.cuePoints[0]'></vg-scrub-bar-cue-points>
 *        </vg-scrub-bar>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls").run(["$templateCache", function ($templateCache) {
    $templateCache.put("vg-templates/vg-scrub-bar-cue-points", '<div class="cue-point-timeline">' + '<div ng-repeat="cuePoint in vgCuePoints" class="cue-point" ng-style="cuePoint.$$style"></div>' + '</div>');
}]).directive("vgScrubBarCuePoints", [function () {
    return {
        restrict: "E",
        require: "^videogular",
        templateUrl: function templateUrl(elem, attrs) {
            return attrs.vgTemplate || 'vg-templates/vg-scrub-bar-cue-points';
        },
        scope: {
            "vgCuePoints": "="
        },
        link: function link(scope, elem, attr, API) {
            scope.onPlayerReady = function onPlayerReady() {
                scope.updateCuePoints(scope.vgCuePoints);
            };
            scope.updateCuePoints = function onUpdateCuePoints(cuePoints) {
                var totalWidth;

                if (cuePoints) {
                    totalWidth = parseInt(elem[0].clientWidth);

                    for (var i = 0, l = cuePoints.length; i < l; i++) {
                        var end = cuePoints[i].timeLapse.end >= 0 ? cuePoints[i].timeLapse.end : cuePoints[i].timeLapse.start + 1;
                        var cuePointDuration = (end - cuePoints[i].timeLapse.start) * 1000;
                        var position = cuePoints[i].timeLapse.start * 100 / Math.round(API.totalTime / 1000) + "%";
                        var percentWidth = 0;

                        if (typeof cuePointDuration === 'number' && API.totalTime) {
                            percentWidth = cuePointDuration * 100 / API.totalTime + "%";
                        }

                        cuePoints[i].$$style = {
                            width: percentWidth,
                            left: position
                        };
                    }
                }
            };

            scope.$watch("vgCuePoints", scope.updateCuePoints);

            scope.$watch(function () {
                return API.totalTime;
            }, function (newVal, oldVal) {
                if (newVal > 0) scope.onPlayerReady();
            });
        }
    };
}]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBarCurrentTime
 * @restrict E
 * @description
 * Layer inside vg-scrub-bar to display the current time.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-scrub-bar>
 *            <vg-scrub-bar-current-time></vg-scrub-bar-current-time>
 *        </vg-scrub-bar>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls").directive("vgScrubBarCurrentTime", [function () {
    return {
        restrict: "E",
        require: "^videogular",
        link: function link(scope, elem, attr, API) {
            var percentTime = 0;

            scope.onUpdateTime = function onUpdateTime(newCurrentTime) {
                if (typeof newCurrentTime === 'number' && API.totalTime) {
                    percentTime = 100 * (newCurrentTime / API.totalTime);
                    elem.css("width", percentTime + "%");
                } else {
                    elem.css("width", 0);
                }
            };

            scope.$watch(function () {
                return API.currentTime;
            }, function (newVal, oldVal) {
                scope.onUpdateTime(newVal);
            });
        }
    };
}]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBarThumbnails
 * @restrict E
 * @description
 * Layer inside vg-scrub-bar to display thumbnails.
 *
 * Param thumbnails could be a string url pointing to a strip of thumbnails or an array of thumbnails
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls>
 *        <vg-scrub-bar>
 *            <vg-scrub-bar-thumbnails vg-thumbnails='config.thumbnails'></vg-scrub-bar-thumbnails>
 *        </vg-scrub-bar>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls").run(["$templateCache", function ($templateCache) {
    $templateCache.put("vg-templates/vg-scrub-bar-thumbnails", '<div class="vg-thumbnails" ng-show="thumbnails" ng-style="thumbnailContainer">' + '<div class="image-thumbnail" ng-style="thumbnails"></div>' + '</div>' + '<div class="background"></div>');
}]).directive("vgScrubBarThumbnails", ["VG_UTILS", function (VG_UTILS) {
    return {
        restrict: "E",
        require: "^videogular",
        templateUrl: function templateUrl(elem, attrs) {
            return attrs.vgTemplate || 'vg-templates/vg-scrub-bar-thumbnails';
        },
        scope: {
            "vgThumbnails": "="
        },
        link: function link(scope, elem, attr, API) {
            var thumbnailsWidth = 0;
            var thumbWidth = 0;
            var slider = elem[0].querySelector(".background");
            var isStrip = typeof scope.vgThumbnails === "string";

            scope.thumbnails = false;
            scope.thumbnailContainer = {};

            scope.getOffset = function getOffset(event) {
                var el = event.target,
                    x = 0;

                while (el && !isNaN(el.offsetLeft)) {
                    x += el.offsetLeft - el.scrollLeft;
                    el = el.offsetParent;
                }

                return event.clientX - x;
            };

            scope.onLoadThumbnails = function (event) {
                thumbnailsWidth = event.currentTarget.naturalWidth;
                thumbWidth = thumbnailsWidth / 100;
            };

            scope.onLoadThumbnail = function (event) {
                thumbWidth = event.currentTarget.naturalWidth;
            };

            scope.updateThumbnails = function (second) {
                var percentage = Math.round(second * 100 / (API.totalTime / 1000));
                var thPos = slider.scrollWidth * percentage / 100 - thumbWidth / 2;

                if (isStrip) {
                    var bgPos = Math.round(thumbnailsWidth * percentage / 100);

                    scope.thumbnailContainer = {
                        "width": thumbWidth + "px",
                        "left": thPos + "px"
                    };

                    scope.thumbnails = {
                        "background-image": 'url("' + scope.vgThumbnails + '")',
                        "background-position": -bgPos + "px 0px"
                    };
                } else {
                    var secondsByPixel = API.totalTime / slider.scrollWidth / 1000;
                    var lapse = {
                        start: Math.floor(second - secondsByPixel / 2),
                        end: Math.ceil(second)
                    };

                    if (lapse.start < 0) lapse.start = 0;
                    if (lapse.end > API.totalTime) lapse.end = API.totalTime;

                    scope.thumbnailContainer = {
                        "left": thPos + "px"
                    };

                    scope.thumbnails = {
                        "background-image": 'none'
                    };

                    for (var i = 0, l = scope.vgThumbnails.length; i < l; i++) {
                        var th = scope.vgThumbnails[i];

                        if (th.timeLapse.end >= 0) {
                            if (lapse.start >= th.timeLapse.start && (lapse.end <= th.timeLapse.end || lapse.end <= th.timeLapse.start)) {
                                scope.thumbnails = {
                                    "background-image": 'url("' + th.params.thumbnail + '")'
                                };
                                break;
                            }
                        } else {
                            if (th.timeLapse.start >= lapse.start && th.timeLapse.start <= lapse.end) {
                                scope.thumbnails = {
                                    "background-image": 'url("' + th.params.thumbnail + '")'
                                };
                                break;
                            }
                        }
                    }
                }
            };

            scope.onMouseMove = function ($event) {
                var second = Math.round($event.offsetX * API.mediaElement[0].duration / slider.scrollWidth);

                scope.updateThumbnails(second);

                scope.$apply();
            };

            scope.onTouchMove = function ($event) {
                var touches = $event.touches;
                var touchX = scope.getOffset(touches[0]);
                var second = Math.round(touchX * API.mediaElement[0].duration / slider.scrollWidth);

                scope.updateThumbnails(second);

                scope.$apply();
            };

            scope.onMouseLeave = function (event) {
                scope.thumbnails = false;

                scope.$apply();
            };

            scope.onTouchLeave = function (event) {
                scope.thumbnails = false;

                scope.$apply();
            };

            scope.onDestroy = function () {
                elem.unbind("touchmove", scope.onTouchMove);
                elem.unbind("touchleave", scope.onTouchLeave);
                elem.unbind("touchend", scope.onTouchLeave);
                elem.unbind("mousemove", scope.onMouseMove);
                elem.unbind("mouseleave", scope.onMouseLeave);
            };

            var thLoader;
            if (isStrip) {
                thLoader = new Image();
                thLoader.onload = scope.onLoadThumbnails.bind(scope);
                thLoader.src = scope.vgThumbnails;
            } else {
                thLoader = new Image();
                thLoader.onload = scope.onLoadThumbnail.bind(scope);
                thLoader.src = scope.vgThumbnails[0].params.thumbnail;
            }

            // Touch move is really buggy in Chrome for Android, maybe we could use mouse move that works ok
            if (VG_UTILS.isMobileDevice()) {
                elem.bind("touchmove", scope.onTouchMove);
                elem.bind("touchleave", scope.onTouchLeave);
                elem.bind("touchend", scope.onTouchLeave);
            } else {
                elem.bind("mousemove", scope.onMouseMove);
                elem.bind("mouseleave", scope.onMouseLeave);
            }

            scope.$on('destroy', scope.onDestroy.bind(scope));
        }
    };
}]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBar
 * @restrict E
 * @description
 * Directive to control the time and display other information layers about the progress of the media.
 * This directive acts as a container and you can add more layers to display current time, cuepoints, buffer or whatever you need.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-scrub-bar></vg-scrub-bar>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls").run(["$templateCache", function ($templateCache) {
    $templateCache.put("vg-templates/vg-scrub-bar", '<div role="slider" ' + 'aria-valuemax="{{ariaTime(API.totalTime)}}" ' + 'aria-valuenow="{{ariaTime(API.currentTime)}}" ' + 'aria-valuemin="0" ' + 'aria-label="Time scrub bar" ' + 'tabindex="0" ' + 'ng-keydown="onScrubBarKeyDown($event)">' + '</div>' + '<div class="container" ng-transclude></div>');
}]).directive("vgScrubBar", ["VG_STATES", "VG_UTILS", function (VG_STATES, VG_UTILS) {
    return {
        restrict: "E",
        require: "^videogular",
        transclude: true,
        templateUrl: function templateUrl(elem, attrs) {
            return attrs.vgTemplate || 'vg-templates/vg-scrub-bar';
        },
        scope: {
            vgThumbnails: "="
        },
        link: function link(scope, elem, attr, API) {
            var isSeeking = false;
            var isPlaying = false;
            var isPlayingWhenSeeking = false;
            var LEFT = 37;
            var RIGHT = 39;
            var NUM_PERCENT = 5;
            var thumbnailsWidth = 0;
            var thumbWidth = 0;
            var slider = elem[0].querySelector("div[role=slider]");

            scope.thumbnails = false;
            scope.thumbnailContainer = {};

            scope.API = API;

            scope.onLoadThumbnails = function (event) {
                thumbnailsWidth = event.path[0].naturalWidth;
                thumbWidth = thumbnailsWidth / 100;
            };

            scope.ariaTime = function (time) {
                return Math.round(time / 1000);
            };

            scope.getOffset = function getOffset(event) {
                var el = event.target,
                    x = 0;

                while (el && !isNaN(el.offsetLeft)) {
                    x += el.offsetLeft - el.scrollLeft;
                    el = el.offsetParent;
                }

                return event.clientX - x;
            };

            scope.onScrubBarTouchStart = function onScrubBarTouchStart($event) {
                console.log($event);
                var event = $event.originalEvent || $event;
                var touches = event.touches;
                var touchX = scope.getOffset(touches[0]);

                isSeeking = true;
                if (isPlaying) isPlayingWhenSeeking = true;
                API.pause();
                API.seekTime(touchX * API.mediaElement[0].duration / slider.scrollWidth);

                scope.$apply();
            };

            scope.onScrubBarTouchEnd = function onScrubBarTouchEnd($event) {
                var event = $event.originalEvent || $event;
                if (isPlayingWhenSeeking) {
                    isPlayingWhenSeeking = false;
                    API.play();
                }
                isSeeking = false;

                scope.$apply();
            };

            scope.onScrubBarTouchMove = function onScrubBarTouchMove($event) {
                var event = $event.originalEvent || $event;
                var touches = event.touches;
                var touchX = scope.getOffset(touches[0]);

                if (scope.vgThumbnails && scope.vgThumbnails.length) {
                    var second = Math.round(touchX * API.mediaElement[0].duration / slider.scrollWidth);
                    var percentage = Math.round(second * 100 / (API.totalTime / 1000));

                    scope.updateThumbnails(percentage);
                }

                if (isSeeking) {
                    API.seekTime(touchX * API.mediaElement[0].duration / slider.scrollWidth);
                }

                scope.$apply();
            };

            scope.onScrubBarTouchLeave = function onScrubBarTouchLeave(event) {
                isSeeking = false;
                scope.thumbnails = false;

                scope.$apply();
            };

            scope.onScrubBarMouseDown = function onScrubBarMouseDown(event) {
                event = VG_UTILS.fixEventOffset(event);

                isSeeking = true;
                if (isPlaying) isPlayingWhenSeeking = true;
                API.pause();

                API.seekTime(event.offsetX * API.mediaElement[0].duration / slider.scrollWidth);

                scope.$apply();
            };

            scope.onScrubBarMouseUp = function onScrubBarMouseUp(event) {
                //event = VG_UTILS.fixEventOffset(event);

                if (isPlayingWhenSeeking) {
                    isPlayingWhenSeeking = false;
                    API.play();
                }
                isSeeking = false;
                //API.seekTime(event.offsetX * API.mediaElement[0].duration / slider.scrollWidth);

                scope.$apply();
            };

            scope.onScrubBarMouseMove = function onScrubBarMouseMove(event) {
                if (scope.vgThumbnails && scope.vgThumbnails.length) {
                    var second = Math.round(event.offsetX * API.mediaElement[0].duration / slider.scrollWidth);
                    var percentage = Math.round(second * 100 / (API.totalTime / 1000));

                    scope.updateThumbnails(percentage);
                }

                if (isSeeking) {
                    event = VG_UTILS.fixEventOffset(event);
                    API.seekTime(event.offsetX * API.mediaElement[0].duration / slider.scrollWidth);
                }

                scope.$apply();
            };

            scope.onScrubBarMouseLeave = function onScrubBarMouseLeave(event) {
                isSeeking = false;
                scope.thumbnails = false;

                scope.$apply();
            };

            scope.onScrubBarKeyDown = function onScrubBarKeyDown(event) {
                var currentPercent = API.currentTime / API.totalTime * 100;

                if (event.which === LEFT || event.keyCode === LEFT) {
                    API.seekTime(currentPercent - NUM_PERCENT, true);
                    event.preventDefault();
                } else if (event.which === RIGHT || event.keyCode === RIGHT) {
                    API.seekTime(currentPercent + NUM_PERCENT, true);
                    event.preventDefault();
                }
            };

            scope.updateThumbnails = function updateThumbnails(percentage) {
                var bgPos = Math.round(thumbnailsWidth * percentage / 100);
                var thPos = slider.scrollWidth * percentage / 100 - thumbWidth / 2;

                scope.thumbnailContainer = {
                    "width": thumbWidth + "px",
                    "left": thPos + "px"
                };

                scope.thumbnails = {
                    "background-image": 'url("' + scope.vgThumbnails + '")',
                    "background-position": -bgPos + "px 0px"
                };
            };

            scope.setState = function setState(newState) {
                if (!isSeeking) {
                    switch (newState) {
                        case VG_STATES.PLAY:
                            isPlaying = true;
                            break;

                        case VG_STATES.PAUSE:
                            isPlaying = false;
                            break;

                        case VG_STATES.STOP:
                            isPlaying = false;
                            break;
                    }
                }
            };

            scope.onDestroy = function () {
                elem.unbind("touchstart", scope.onScrubBarTouchStart);
                elem.unbind("touchend", scope.onScrubBarTouchEnd);
                elem.unbind("touchmove", scope.onScrubBarTouchMove);
                elem.unbind("touchleave", scope.onScrubBarTouchLeave);
                elem.unbind("mousedown", scope.onScrubBarMouseDown);
                elem.unbind("mouseup", scope.onScrubBarMouseUp);
                elem.unbind("mousemove", scope.onScrubBarMouseMove);
                elem.unbind("mouseleave", scope.onScrubBarMouseLeave);
            };

            scope.$watch(function () {
                return API.currentState;
            }, function (newVal, oldVal) {
                if (newVal != oldVal) {
                    scope.setState(newVal);
                }
            });

            if (scope.vgThumbnails) {
                var thLoader = new Image();
                thLoader.onload = scope.onLoadThumbnails.bind(scope);
                thLoader.src = scope.vgThumbnails;
            }

            // Touch move is really buggy in Chrome for Android, maybe we could use mouse move that works ok
            if (VG_UTILS.isMobileDevice()) {
                elem.bind("touchstart", scope.onScrubBarTouchStart);
                elem.bind("touchend", scope.onScrubBarTouchEnd);
                elem.bind("touchmove", scope.onScrubBarTouchMove);
                elem.bind("touchleave", scope.onScrubBarTouchLeave);
            } else {
                elem.bind("mousedown", scope.onScrubBarMouseDown);
                elem.bind("mouseup", scope.onScrubBarMouseUp);
                elem.bind("mousemove", scope.onScrubBarMouseMove);
                elem.bind("mouseleave", scope.onScrubBarMouseLeave);
            }

            scope.$on('destroy', scope.onDestroy.bind(scope));
        }
    };
}]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgTimeDisplay
 * @restrict E
 * @description
 * Adds a time display inside vg-controls to play and pause media.
 * You have three scope variables to show current time, time left and total time.
 *
 * Those scope variables are in milliseconds, you can add a date filter to show the time as you wish.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-time-display>{{currentTime | date:'hh:mm'}}</vg-time-display>
 *        <vg-time-display>{{timeLeft | date:'mm:ss'}}</vg-time-display>
 *        <vg-time-display>{{totalTime | date:'hh:mm:ss'}}</vg-time-display>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls").directive("vgTimeDisplay", [function () {
    return {
        require: "^videogular",
        restrict: "E",
        link: function link(scope, elem, attr, API) {
            scope.currentTime = API.currentTime;
            scope.timeLeft = API.timeLeft;
            scope.totalTime = API.totalTime;
            scope.isLive = API.isLive;

            scope.$watch(function () {
                return API.currentTime;
            }, function (newVal, oldVal) {
                scope.currentTime = newVal;
            });

            scope.$watch(function () {
                return API.timeLeft;
            }, function (newVal, oldVal) {
                scope.timeLeft = newVal;
            });

            scope.$watch(function () {
                return API.totalTime;
            }, function (newVal, oldVal) {
                scope.totalTime = newVal;
            });

            scope.$watch(function () {
                return API.isLive;
            }, function (newVal, oldVal) {
                scope.isLive = newVal;
            });
        }
    };
}]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgMuteButton
 * @restrict E
 * @description
 * Directive to display a button to mute volume.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume>
 *            <vg-mute-button><vg-mute-button>
 *        </vg-volume>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls").run(["$templateCache", function ($templateCache) {
    $templateCache.put("vg-templates/vg-mute-button", '<button type="button" class="iconButton" ng-class="muteIcon" ng-click="onClickMute()" ng-focus="onMuteButtonFocus()" ng-blur="onMuteButtonLoseFocus()" ng-mouseleave="onMuteButtonLeave()" ng-keydown="onMuteButtonKeyDown($event)" aria-label="Mute"></button>');
}]).directive("vgMuteButton", [function () {
    return {
        restrict: "E",
        require: "^videogular",
        templateUrl: function templateUrl(elem, attrs) {
            return attrs.vgTemplate || 'vg-templates/vg-mute-button';
        },
        link: function link(scope, elem, attr, API) {
            var isMuted = false;
            var UP = 38;
            var DOWN = 40;
            var CHANGE_PER_PRESS = 0.05;

            scope.onClickMute = function onClickMute() {
                if (isMuted) {
                    scope.currentVolume = scope.defaultVolume;
                } else {
                    scope.currentVolume = 0;
                    scope.muteIcon = { mute: true };
                }

                isMuted = !isMuted;

                API.setVolume(scope.currentVolume);
            };

            scope.onMuteButtonFocus = function onMuteButtonFocus() {
                scope.volumeVisibility = "visible";
            };

            scope.onMuteButtonLoseFocus = function onMuteButtonLoseFocus() {
                scope.volumeVisibility = "hidden";
            };

            scope.onMuteButtonLeave = function onMuteButtonLeave() {
                document.activeElement.blur();
            };

            scope.onMuteButtonKeyDown = function onMuteButtonKeyDown(event) {
                var currentVolume = API.volume != null ? API.volume : 1;
                var newVolume;

                if (event.which === UP || event.keyCode === UP) {
                    newVolume = currentVolume + CHANGE_PER_PRESS;
                    if (newVolume > 1) newVolume = 1;

                    API.setVolume(newVolume);
                    event.preventDefault();
                } else if (event.which === DOWN || event.keyCode === DOWN) {
                    newVolume = currentVolume - CHANGE_PER_PRESS;
                    if (newVolume < 0) newVolume = 0;

                    API.setVolume(newVolume);
                    event.preventDefault();
                }
            };

            scope.onSetVolume = function onSetVolume(newVolume) {
                scope.currentVolume = newVolume;

                isMuted = scope.currentVolume === 0;

                // if it's not muted we save the default volume
                if (!isMuted) {
                    scope.defaultVolume = newVolume;
                } else {
                    // if was muted but the user changed the volume
                    if (newVolume > 0) {
                        scope.defaultVolume = newVolume;
                    }
                }

                var percentValue = Math.round(newVolume * 100);
                if (percentValue == 0) {
                    scope.muteIcon = { mute: true };
                } else if (percentValue > 0 && percentValue < 25) {
                    scope.muteIcon = { level0: true };
                } else if (percentValue >= 25 && percentValue < 50) {
                    scope.muteIcon = { level1: true };
                } else if (percentValue >= 50 && percentValue < 75) {
                    scope.muteIcon = { level2: true };
                } else if (percentValue >= 75) {
                    scope.muteIcon = { level3: true };
                }
            };

            scope.defaultVolume = 1;
            scope.currentVolume = scope.defaultVolume;
            scope.muteIcon = { level3: true };

            //Update the mute button on initialization, then watch for changes
            scope.onSetVolume(API.volume);
            scope.$watch(function () {
                return API.volume;
            }, function (newVal, oldVal) {
                if (newVal != oldVal) {
                    scope.onSetVolume(newVal);
                }
            });
        }
    };
}]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgVolumeBar
 * @restrict E
 * @description
 * Directive to display a vertical volume bar to control the volume.
 * This directive must be inside vg-volume directive and requires vg-mute-button to be displayed.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume>
 *            <vg-mute-button><vg-mute-button>
 *            <vg-volume-bar><vg-volume-bar>
 *        </vg-volume>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls").run(["$templateCache", function ($templateCache) {
    $templateCache.put("vg-templates/vg-volume-bar", '<div class="verticalVolumeBar">\
              <div class="volumeBackground" ng-click="onClickVolume($event)" ng-mousedown="onMouseDownVolume()" ng-mouseup="onMouseUpVolume()" ng-mousemove="onMouseMoveVolume($event)" ng-mouseleave="onMouseLeaveVolume()">\
                <div class="volumeValue"></div>\
                <div class="volumeClickArea"></div>\
              </div>\
            </div>');
}]).directive("vgVolumeBar", ["VG_UTILS", function (VG_UTILS) {
    return {
        restrict: "E",
        require: "^videogular",
        templateUrl: function templateUrl(elem, attrs) {
            return attrs.vgTemplate || 'vg-templates/vg-volume-bar';
        },
        link: function link(scope, elem, attr, API) {
            var isChangingVolume = false;
            var volumeBackElem = angular.element(elem[0].getElementsByClassName("volumeBackground"));
            var volumeValueElem = angular.element(elem[0].getElementsByClassName("volumeValue"));

            scope.onClickVolume = function onClickVolume(event) {
                event = VG_UTILS.fixEventOffset(event);
                var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
                var value = event.offsetY * 100 / volumeHeight;
                var volValue = 1 - value / 100;

                API.setVolume(volValue);
            };

            scope.onMouseDownVolume = function onMouseDownVolume() {
                isChangingVolume = true;
            };

            scope.onMouseUpVolume = function onMouseUpVolume() {
                isChangingVolume = false;
            };

            scope.onMouseLeaveVolume = function onMouseLeaveVolume() {
                isChangingVolume = false;
            };

            scope.onMouseMoveVolume = function onMouseMoveVolume(event) {
                if (isChangingVolume) {
                    event = VG_UTILS.fixEventOffset(event);
                    var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
                    var value = event.offsetY * 100 / volumeHeight;
                    var volValue = 1 - value / 100;

                    API.setVolume(volValue);
                }
            };

            scope.updateVolumeView = function updateVolumeView(value) {
                value = value * 100;
                volumeValueElem.css("height", value + "%");
                volumeValueElem.css("top", 100 - value + "%");
            };

            scope.onChangeVisibility = function onChangeVisibility(value) {
                elem.css("visibility", value);
            };

            elem.css("visibility", scope.volumeVisibility);

            scope.$watch("volumeVisibility", scope.onChangeVisibility);

            //Update the volume bar on initialization, then watch for changes
            scope.updateVolumeView(API.volume);
            scope.$watch(function () {
                return API.volume;
            }, function (newVal, oldVal) {
                if (newVal != oldVal) {
                    scope.updateVolumeView(newVal);
                }
            });
        }
    };
}]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgVolume
 * @restrict E
 * @description
 * Directive to control the volume.
 * This directive acts as a container and you will need other directives like vg-mutebutton and vg-volumebar to control the volume.
 * In mobile will be hided since volume API is disabled for mobile devices.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume></vg-volume>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls").directive("vgVolume", ["VG_UTILS", function (VG_UTILS) {
    return {
        restrict: "E",
        link: function link(scope, elem, attr) {
            scope.onMouseOverVolume = function onMouseOverVolume() {
                scope.$evalAsync(function () {
                    scope.volumeVisibility = "visible";
                });
            };

            scope.onMouseLeaveVolume = function onMouseLeaveVolume() {
                scope.$evalAsync(function () {
                    scope.volumeVisibility = "hidden";
                });
            };

            scope.onDestroy = function () {
                elem.unbind("mouseover", scope.onScrubBarTouchStart);
                elem.unbind("mouseleave", scope.onScrubBarTouchEnd);
            };

            // We hide volume controls on mobile devices
            if (VG_UTILS.isMobileDevice()) {
                elem.css("display", "none");
            } else {
                scope.volumeVisibility = "hidden";

                elem.bind("mouseover", scope.onMouseOverVolume);
                elem.bind("mouseleave", scope.onMouseLeaveVolume);
            }

            scope.$on('destroy', scope.onDestroy.bind(scope));
        }
    };
}]);
'use strict';

(function () {
  // !!!!!DEVELOPMENT
  angular.module('seventeendays').constant('ENDPOINTS', {
    environment: 'development',
    VIEWER_LOGS: '/viewer_logs',
    REGISTRATION: '/rest/user/register',
    LOGIN: '/rest/user/session',
    LESSON: '/rest/backend/_table/users?filter=email%3D',
    ACTIVATION_CODE: '/activation_codes',
    USERS: '/users',
    RESPONSE: '/responses',
    API: 'http://localhost:3000/api'
  });
})();