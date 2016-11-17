(function(){

  angular.module('seventeendays').constant('FRIENDLY_ERRORS', {
      getMessage: function(key, defolt){
        return this.get(key, defolt);
      },
      getException: function(key, defolt){
        var e = this.get(key, defolt);
        return { exception: e };
      },
      get: function(key, defolt){
        defolt = defolt || 'default';
        try {
          return this[key] || this[defolt];
        } catch (z){
          return this[defolt];
        }
      },
      'default': 'An error occurred.',
      'login.default':'An error occured. Please try again.',
      'login.emailIsInvalid': 'Invalid email format.',
      'login.emailPasswordRequired':'Email and password are required.',
      'login.unauthorized':'The email/password entered is incorrect',
      'register.default': 'Registration failed. Please try again.',
      'register.passwordsNoMatch':'Passwords do not match.',
      'register.passwordTooShort':'Password must be at least 8 characters.',
      'register.emailAlreadyTaken':'That email address has already been used. Please use a different email address.',
      'register.thanks':'Thanks for registering! You will now be redirected to the login page. Please log in with your credentials.',
      'reset.default':'An error occured with your reset request. Please try again.',
      'reset.cantFindEmail':'A user with that email address could not be found.',
      'reset.requestSuccess':'Your request was successful. Please check your email for a reset link.',
      'reset.success':'Your password was properly reset and you should be logged in now.',
    });

})()
