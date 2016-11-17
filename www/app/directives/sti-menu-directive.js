(function() {

  /*
   * Renders the STI choice menu.
   */

  angular.module('seventeendays').directive('stiMenu', () => {
    return {
      templateUrl: 'app/templates/directives/sti-menu.html',
      transclude: true,
      restrict: 'E',
      link: (scope, element, attrs) => {
        scope.choicePrefix = attrs.choicePrefix;
      }
    };
  });

})();
