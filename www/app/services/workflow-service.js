(function() {

  /*
   * Manages the state of the application in relation to the
   * storyline.
   */

  angular.module('seventeendays').factory('WorkflowService', ($state, $timeout, $ionicPopup, $rootScope, DataService,
    TrackingService, localStorageService, userSessionService, surveyService) => {
    let viewModel;
    let sectionKey;
    let sectionPaths;
    let currentPath;
    let currentStepIndex;
    let videoAPI = {};

    /* Utility functions
      ------------------------------------ */
    function currentStep() {
      return currentPath.steps[currentStepIndex];
    }

    function stepIsVideo(step) {
      if(step.indexOf('.mp4') > -1) {
        $rootScope.videoComplete = false;
        return true;
      } else {
        $rootScope.videoComplete = true;
        return false;
      }
    }

    function constructVideoSource(step) {
      $rootScope.currentVideoFile = step;
      const videoBase = 'http://dh5ycesfech6i.cloudfront.net';
      const personKeys = ['eva', 'hailey', 'isabel', 'lauren', 'maya', 'nicki', 'jessica'];
      const openKeys = ['open4noquit.mp4', 'open2.mp4', 'open3.mp4'];
      const jessicaKeys = ['kyb.mp4','bcintro.mp4','gynecog1.mp4','gynecog2.mp4','condoms.mp4'];
      const localLesson = localStorageService.get('Lesson');
      let videoSubdir;

      if(~personKeys.indexOf(sectionKey)) {
        videoSubdir = sectionKey[0].toUpperCase() + sectionKey.slice(1);
      } else if(sectionKey.match(/^sti/)) {
        videoSubdir = 'STIs';
      } else if(sectionKey === 'birthcontrol') {
        videoSubdir = 'Jessica';
      } else if(sectionKey === 'kyb') {
        videoSubdir = 'know_your_body';
      } else if(~sectionKey.indexOf('open') || sectionKey === 'close') {
        videoSubdir = 'Open';
      } else if(~localLesson.indexOf('lesson')) {
        if(~jessicaKeys.indexOf(step)) {
          videoSubdir = 'Jessica';
        } else if(~openKeys.indexOf(step)) {
          videoSubdir = 'Open';
        } else if(localLesson.charAt(0) == 'e' || ~localLesson.indexOf('makeupes')) {
          videoSubdir = 'eat_smart';
        } else {
          videoSubdir = 'lessons';
        }
      } else {
        throw `Invalid section key! ${sectionKey}`;
      }

      return {
        src: `${videoBase}/${videoSubdir}/${step}`,
        type: 'video/mp4'
      };
    }

    function addVideoSource(step) {
      viewModel.videoSources = [constructVideoSource(step)];
    }

    // startTime is number of seconds into the video you want it to start
    function playFromPoint(step, startTime) {
      viewModel.videoSources = [constructVideoSource(step)];
      if(videoAPI.isReady) {
        $timeout(() => videoAPI.seekTime(startTime), 0);
      }
    }

    function positionInTime(step) {
      return {
        type: stepIsVideo(step) ? 'mp4' : 'html',
        value: step
      };
    }
    /* ------------------------------------ */

    /*
     * Handle a user's path choice within an app section.
     */
    function choosePath(key) {
      $rootScope.currentKey = key;
      let step = "";
      currentPath = sectionPaths[key];
      currentStepIndex = 0;
      let user = userSessionService.getCurrentUser();
      if (!$rootScope.resume) {
        if(currentPath) {
          step = currentStep();
          TrackingService.trackPath(currentPath);

          if(stepIsVideo(step)) {
            addVideoSource(step);
          }
        }
      } else {
        if (user.position !== 'bonfire') {
          if (user.position.indexOf('lesson') > -1) {
            localStorageService.set('Lesson', user.position);
          }
          if (currentPath.steps.indexOf(user.current_file) > -1) {
            step = user.current_file
            TrackingService.trackPath(currentPath);
            if(stepIsVideo(step)) { playFromPoint(step, user.current_file_time); }
          } else {
            step = currentStep();
            TrackingService.trackPath(currentPath);
            if(stepIsVideo(step)) { addVideoSource(step); }
          }
        } else {
          $state.go('app.section', {key: 'bonfire'})
        }
        $rootScope.resume = false;
      }

      return positionInTime(step);
    }

    /*
     * Advance in or from the chosen navigation path.
     */
    function advance() {
      let step;
      // Altering this variable for lesson interactivity countdown timer

      if(currentStepIndex < currentPath.steps.length - 1) {
        currentStepIndex += 1;
        step = currentStep();
        TrackingService.trackStep(step);

        if(stepIsVideo(step)) {
          // Smelly fix for starting specific videos in makeup lessons at points
          if(currentPath.label.indexOf("Lesson 1") > -1 && step === "open4noquit.mp4") {
            playFromPoint(step, 10);
          } else if(currentPath.label.indexOf("Lesson 4") > -1 && step === "open2.mp4") {
            playFromPoint(step, 680);
          } else {
            addVideoSource(step);
          }
        }

        return positionInTime(step);
      } else {
        if(currentPath.redirect) {
          // Starts a lesson interactivity countdown timer if necessary
          if(currentPath.lessonEnd) {
            TrackingService.countdown(currentPath.countdownTime);
          }
          // If there is a redirect, go there
          if(currentPath.redirectView) {
            $state.go('app.section', { key: currentPath.redirect });
          } else {
            return choosePath(currentPath.redirect);
          }
        } else {
          // Check to see if user is in a lesson
          if(localStorageService.get('Lesson')) {
            let lessonPosition = localStorageService.get('Lesson');
            // If it's the end of the lesson, show the lesson complete popup & return to lesson-code page
            if(currentPath.lessonEnd) {
              TrackingService.lessonCompletePopup();
            } else {
              // otherwise go to the particular lesson's end path
              let toState = 'app.lesson';
              if (~lessonPosition.indexOf('makeup')) { toState = 'app.makeup-lesson';}
              $state.go(toState, {key: lessonPosition + 'close'});
            }
          } else {
            // If the user doesn't have an activation code, end their session
            if(currentPath.label === "Preview") {
              previewPopup();
            } else {
              // If there is no redirect, and user isn't in a lesson, move to the original ending of the app
              $state.go('app.section', { key: 'close' });
            }
          }
        }
      }
    }

    /*
     * Set section related stores.
     */
    function chooseSection(key, vm) {
      viewModel = vm;
      sectionKey = key;
      sectionPaths = DataService.getPathData(key);
      userSessionService.updatePosition(key);
    }

    function previewPopup() {
      $ionicPopup.alert({
        title: 'Preview Complete',
        template: "You have finished your preview. Please click 'OK' to continue to account activation or you can rewatch the preview via the 'Return to Preview' button in the menu sidebar."
      })
      .then(function() {
        $state.go('app.activate');
      });
    }

    /*
     * Set the video API.
     */
    function setVideoAPI(api) {
      videoAPI = api;
    }

    return {
      choosePath,
      advance,
      chooseSection,
      setVideoAPI,
      currentStep
    };
  });

})();
