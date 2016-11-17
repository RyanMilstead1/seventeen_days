(function() {

  /*
   * Provides access to the application data.
   */

  angular.module('seventeendays').factory('DataService', (DATA) => {
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
      getPathData,
      getStepData
    };
  });

})();
