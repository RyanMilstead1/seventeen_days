
(function() {
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
    API:'http://localhost:3000/api'
  });

})();
