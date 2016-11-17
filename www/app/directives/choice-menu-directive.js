(function() {

  /*
   * Renders a choice menu.
   */

  angular.module('seventeendays').directive('choiceMenu', () => {
    return {
      templateUrl: 'app/templates/directives/choice-menu.html',
      transclude: true,
      restrict: 'E',
      link: (scope, element, attrs) => {
        scope.backgroundImg = attrs.background;
      }
    };
  });

})();
