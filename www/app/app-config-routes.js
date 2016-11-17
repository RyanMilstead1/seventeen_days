(function(){

  angular.module('seventeendays')
    .config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider, ENDPOINTS){
      $sceDelegateProvider.resourceUrlWhitelist([
         // Allow same origin resource loads.
         'self',
         // Allow loading from our assets domain.  Notice the difference between * and **.
        ENDPOINTS.API + '/**']);

      $stateProvider
        .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "views/menu.html",
          controller: 'MainCtrl'
        })

        .state('app.access', {
          requiresAuth: false,
          url: "/access",
          views: {
            'menuContent' :{
              templateUrl: "views/access.html",
              controller: 'AccessCtrl'
            }
          }
        })

        .state('app.activate', {
          requiresAuth: true,
          url: "/activate",
          views: {
            'menuContent' :{
              templateUrl: "views/activate.html",
              controller: 'ActivateCtrl'
            }
          }
        })

        .state('app.login', {
          requiresAuth: false,
          url: "/login",
          views: {
            'menuContent' :{
              templateUrl: "views/login.html",
              controller: 'LoginCtrl'
            }
          }
        })

        .state('app.logout', {
          requiresAuth: false,
          url: "/logout",
          views: {
            'menuContent' :{
              template: '',
              controller: 'LogoutCtrl'
            }
          }
        })

        .state('app.register', {
          requiresAuth: false,
          url: "/register?activationCode",
          views: {
            'menuContent' :{
              templateUrl: "views/register.html",
              controller: 'RegisterCtrl'
            }
          }
        })

        .state('app.preview', {
          requiresAuth: false,
          url: "/preview",
          views: {
            'menuContent' :{
              templateUrl: "views/preview.html",
              controller: 'PreviewCtrl'
            }
          }
        })

        .state('app.register-confirm', {
          requiresAuth: true,
          url: "/register-confirm",
          views: {
            'menuContent': {
              templateUrl: "views/register-confirm.html",
              controller: 'RegisterCtrl'
            }
          }
        })

        .state('app.password-reset', {
          requiresAuth: false,
          url: "/password-reset",
          views: {
            'menuContent': {
              templateUrl: "views/password-reset.html",
              controller: 'PasswordResetCtrl'
            }
          }
        })

        .state('app.reset-request', {
          requiresAuth: false,
          url: "/password-reset-request",
          views: {
            'menuContent': {
              templateUrl: "views/reset-request.html",
              controller: 'ResetRequestCtrl'
            }
          }
        })

        .state('app.lesson-code', {
          requiresAuth: true,
          url: "/lesson-code",
          views: {
            'menuContent': {
              templateUrl: 'views/lesson-code.html',
              controller: 'LessonCodeCtrl'
            }
          }
        })

        .state('app.makeup-lesson-code', {
          requiresAuth: true,
          url: "/makeup-lesson-code",
          views: {
            'menuContent': {
              templateUrl: 'views/makeup-lesson-code.html',
              controller: 'MakeupLessonCodeCtrl'
            }
          }
        })

        .state('app.section', {
          requiresAuth: true,
          url: "/section/:key",
          views: {
            'menuContent': {
              templateUrl: $stateParams => `views/${$stateParams.key}.html`
            }
          }
        })

        .state('app.lesson', {
          requiresAuth: true,
          url: '/lessons/:key',
          views: {
            'menuContent': {
              templateUrl: $stateParams => 'views/lessons/' + $stateParams.key + '.html'
            }
          }
        })

        .state('app.makeup-lesson', {
          requiresAuth: true,
          url: '/makeup-lessons/:key',
          views: {
            'menuContent': {
              templateUrl: $stateParams => 'views/makeup-lessons/' + $stateParams.key + '.html'
            }
          }
        });

      $urlRouterProvider.otherwise('/app/access');
    });
})()
