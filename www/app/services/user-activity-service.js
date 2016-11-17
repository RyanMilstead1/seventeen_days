// (function() {

//   /*
//    * Provides access to activation data.
//    */

//   angular.module('seventeendays').service('UserActivityService', 
//     function($timeout, $document, $ionicModal, $rootScope, WorkflowService, $state){

//       let timeOfLastAction = undefined;
//       let inactivityLogoutPromise = undefined;
//       let userStatusPromise = undefined;
//       let modalInstance = undefined;
//       const TTL = 5000;
//       const UPDATE_INTERVAL = 5000;
//       var self = this;

//       this.registerEvents = function(){

//         $document.off();

//         var eventsToObserve = [
//           'mousemove','click','touchstart', 'touchend', 'touchmove', 'touchcancel',
//           'blur','focus','focusin','focusout','load','resize','scroll','unload','click','dblclick',
//           'mousedown','mouseup','mousemove','mouseover','mouseout','mouseenter','mouseleave',
//           'change','select','submit','keydown','keypress','keyup','error','contextmenu'
//         ];

//         for(var i =0;i<eventsToObserve.length;i++){
//           $document.on(eventsToObserve[i],()=>{
//             timeOfLastAction = new Date();
//             _handleUserInactivity();
//           });
//         }

//         _handleUserInactivity();
//       }

//       this.trackUserActivity = function(){
//         $timeout.cancel(userStatusPromise);
//         userStatusPromise = $timeout(()=>{
//           _updateUserStatus();
//         }, UPDATE_INTERVAL);
//       }

//       function _updateUserStatus(){
//         console.log('!!!updating user status!!!!');
//         self.trackUserActivity();
//       }

//       function _handleUserInactivity(){
//         $timeout.cancel(inactivityLogoutPromise);
//         inactivityLogoutPromise = $timeout(()=>{
//           _getModalResult();
//         }, TTL);

//       }

//       function _getModalResult(){

//         if (modalInstance) return;

//         let scope = $rootScope.$new();
//         scope.TTL = TTL;

//         scope.$on('modal.removed', function() {
//           _handleUserInactivity();
//         });

//         scope.stop = function(){
//           modalInstance.hide();
//           modalInstance.remove();
//           modalInstance = undefined;
//           WorkflowService.getVideoAPI().stop();

//         };

//         scope.continue = function(){
//           //todo: resume video-->
//           modalInstance.hide();
//           modalInstance.remove();
//           modalInstance = undefined;
//           // WorkflowService.getVideoAPI().play();
//         }
        
//         return $ionicModal.fromTemplateUrl('views/inactivity-modal.html', {
//           scope: scope,
//           animation: 'slide-in-up'
//         }).then(function(modal) {
//           modalInstance = modal;
//           WorkflowService.getVideoAPI().pause();
//           return modalInstance.show();
//         });
//       }

//   });

// })()