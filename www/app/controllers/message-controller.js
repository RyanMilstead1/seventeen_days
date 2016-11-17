(function() {

  /*
   * Manages DF messages.
   */

  angular.module('seventeendays').controller('MessageCtrl', function($scope) {
    $scope.currentError = null;
    $scope.currentInfo = null;

    $scope.parseInfo = function (dataObj) {
      // create a place to store the error
      var message = null;

      // If the exception type is a string we don't need to go any further
      // This was thrown explicitly by the module due to a module error
      // unrelated to the server
      if (typeof dataObj === 'string'){

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
        if (typeof errorDataObj.exception === 'string'){

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
            if(errorDataObj.exception.data.error.length > 1) {

              // yes. Let's loop through and concat these to display to the user
              angular.forEach(errorDataObj.exception.data.error, function(obj) {
                // add the message from each error obj to the error store
                error += obj.message + '\n';
              })

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

    $scope.clearError = function() {
        $scope.currentError = null;
    };

    $scope.clearInfo = function() {
        $scope.currentInfo = null;
    };

    $scope.$on('error', function(e, errorMessageObj) {
        $scope.clearInfo();
        $scope.currentError = $scope.parseError(errorMessageObj);
    });

    $scope.$on('info', function(e, messageObj) {
        $scope.clearError();
        $scope.currentInfo = $scope.parseInfo(messageObj);
    });
  });

})();
