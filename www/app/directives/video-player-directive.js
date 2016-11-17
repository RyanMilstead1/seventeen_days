(function() {

  /*
   * Encapsulates behavior and declarative rendering of the
   * video player.
   */

  angular.module('seventeendays').directive('videoPlayer', () => {
    return {
      templateUrl: 'app/templates/directives/video-player.html',
      restrict: 'E',
      replace: true,
      link: (scope, element, attrs) => {
        scope.config = {
          preload: "metadata",
          autoHide: true,
          autoHideTime: 3000,
          autoPlay: true,
          responsive: true,
          inline: true,
          theme: { url: "lib/videogular-themes-default/videogular.min.css" },
          plugins: {}
        };
      }
    };
  });

})();
