(function() {

  /*
   * Renders a choice menu with a standalone cog button.
   */

  angular.module('seventeendays').directive('choiceMenuCogBtn', () => {
    return {
      templateUrl: 'app/templates/directives/choice-menu-cog-btn.html',
      restrict: 'E',
      link: (scope, element, attrs) => {
        scope.linkClass = attrs.linkClass || 'openCog1';
        scope.backgroundImg = attrs.background;
      }
    };
  });

})();
