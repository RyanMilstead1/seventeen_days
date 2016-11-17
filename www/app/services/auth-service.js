angular.module('seventeendays')
  .service('authService', ['$http', '$stateParams', '$q', '$location', 'ENDPOINTS', '$window', '$auth',
    function ($http, $stateParams, $q, $location, ENDPOINTS, $window, $auth) {

      var _this = this;

      //stubUrl to get around angular url '#' check on the backend (via devise_token_auth)
      this.originUrl = $window.location.origin;

      this.login = function(provider){
        console.log("IN LOGIN");
        var deferred = $q.defer();
        //open IAB window
        var authUrl = ENDPOINTS.API + '/auth/' + provider + '/?auth_origin_url=' + _this.originUrl;
        var browserWindow = $window.open(authUrl, '_blank', 'location=no');

        // listen for IAB window finish loading
        browserWindow.addEventListener( "loadstop", function() {
          //grab linkedin authcode from url response
          getAuthCodeFromResponse(browserWindow)
            .then(function(success){
              deferred.resolve();
            }, function(err){

            })
        });
        return deferred.promise
      }

      // function called when the browser is closed
      function browserOnClose (output){
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

      function getAuthCodeFromResponse(browserWindow){
        console.log("IN GET AUTH CODE FROM RESPONSE");
        var deferred = $q.defer();
        // we get the url everythime the page loads
        browserWindow.executeScript({code: "document.URL" },

          //that url is passed to this function
          function( url ) {
            var _url = url.toString();

            // we check if the callback page was reached
            if(_url.indexOf("callback") > -1 && _url.match( /(twitter|facebook|instagram)/)){
              // the callback page was reached therefore it contains the json output returned from the server
              // we parse the html page to strip out the html tags and keep the json string
              browserWindow.executeScript({code: "document.body.innerHTML" },function(response){
                browserWindow.close();
                // we close the window and call this function with the url and the json output
                browserOnClose({url: url, response: response});
                deferred.resolve();
              });
            }
          }
        );
        return deferred.promise
      }

    }
  ])
