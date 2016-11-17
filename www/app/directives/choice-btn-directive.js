(function() {

  /*
   * Renders a standalone choice button.
   *
   * If the 'section' attribute is provided, the directive binds
   * a click to vm.selectSection(section); otherwise, the directive
   * binds a click to vm.moveTimeline(choice).
   *
   * The directive assumes that a SectionCtrl 'vm' is
   * accessible from the template.
   */

  angular.module('seventeendays').directive('choiceBtn', () => {
    return {
      templateUrl: 'app/templates/directives/choice-btn.html',
      replace: true,
      restrict: 'E',
      scope: true,
      link: (scope, element, attrs) => {
        scope.choice = attrs.choice || false;
        scope.section = attrs.section || false;
        scope.linkClass = attrs.linkClass || 'openCog1';
        scope.btnClass = attrs.btnClass || 'choiceBtn';
        scope.overClass = '';
        scope.backgroundImg = attrs.background;

        attrs.$observe('choice', val => scope.choice = val || false);
        attrs.$observe('section', val => scope.section = val || false);
      }
    };
  });

})();
