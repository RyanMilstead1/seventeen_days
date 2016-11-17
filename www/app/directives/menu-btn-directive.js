(function() {

  /*
   * Renders the fixed menu button.
   */

  angular.module('seventeendays').directive('menuBtn', () => {
    return {
      templateUrl: 'app/templates/directives/menu-btn.html',
      restrict: 'E',
      replace: true,
      link: (scope, element, attrs) => {
        scope.btnClass = attrs.btnClass || 'button';
        attrs.$observe('btnClass', val => scope.btnClass = val || 'button');
      }
    };
  });

})();
