
(function() {
    // !!!!!PRODUCTION
  angular.module('seventeendays').constant('ENDPOINTS', {
    environment: 'production',
    VIEWER_LOGS: '/viewer_logs',
    REGISTRATION: '/rest/user/register',
    LOGIN: '/rest/user/session',
    LESSON: '/rest/backend/_table/users?filter=email%3D',
    ACTIVATION_CODE: '/activation_codes',
    USERS: '/users',
    RESPONSE: '/responses',
    API:'http://ec2-52-35-252-74.us-west-2.compute.amazonaws.com/api'
  });

})();
