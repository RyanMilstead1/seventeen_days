angular.module('seventeendays')
  .controller('evaCtrl', function($scope, videoPlaylist){
    var evaPaths = [
      { selection: 'opening', value1: 'evaopen.mp4', value2: 'evachoice1.html', thisaction: 'timestamp', marker: 'Eva', steps: 2, },

      { selection: 'evachoice1a', label: 'Pretty convincing', value1: 'evachoice1a.mp4', value2: 'evachoice2.html', thisaction: 'increment', marker: 'Choice1', steps: 2},
      { selection: 'evachoice1b', label: 'You dont know me', value1: 'evachoice1c.mp4', value2: 'evacog1.html', value3: 'evaend1bc.mp4', redirect: 'evachoice1a', thisaction: 'increment', marker: 'Choice1', steps: 3},
      { selection: 'evachoice1c', label: 'Not here for that', value1: 'evachoice1b.mp4', value2: 'evacog1.html', value3: 'evaend1bc.mp4', redirect: 'evachoice1a', thisaction: 'increment', marker: 'Choice1', steps: 3},

      { selection: 'evachoice2a', label: 'Lets go', value1: 'evachoice2a.mp4', value2: 'evachoice3.html', thisaction: 'increment', marker: 'Choice2', steps: 2},
      { selection: 'evachoice2b', label: 'I want to stay here', value1: 'evachoice2b.mp4', value2: 'evacog2.html', value3: 'evaend2bc.mp4', redirect: 'evachoice2a', thisaction: 'increment', marker: 'Choice2', steps: 3},
      { selection: 'evachoice2c', label: 'I have to help Lauren', value1: 'evachoice2c.mp4', value2: 'evacog2.html', value3: 'evaend2bc.mp4', redirect: 'evachoice2a', thisaction: 'increment', marker: 'Choice2', steps: 3},

      { selection: 'evachoice3a', label: 'Wow nice', value1: 'evachoice3a.mp4', value2: 'evachoice4.html', thisaction: 'increment', marker: 'Choice3', steps: 2},
      { selection: 'evachoice3b', label: 'Keep my clothes on', value1: 'evachoice3b.mp4', value2: 'evacog3.html', value3: 'evaend3bc.mp4', redirect: 'evachoice3a', thisaction: 'increment', marker: 'Choice3', steps: 3},
      { selection: 'evachoice3c', label: 'Dont know you', value1: 'evachoice3c.mp4', value2: 'evacog3.html', value3: 'evaend3bc.mp4', redirect: 'evachoice3a', thisaction: 'increment', marker: 'Choice3', steps: 3},

      { selection: 'evachoice4a', label: 'Do you have a condom', value1: 'evachoice4a.mp4', value2: 'evachoice4b.mp4', value3: 'evacog4-1.html', value4: 'eva4b-2.mp4', value5: 'evacog4-2.html', value6: 'evaend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 6},
      { selection: 'evachoice4b', label: 'I have one', value1: 'evachoice4b.mp4', value2: 'evacog4-1.html', value3: 'eva4b-2.mp4', value4: 'evacog4-2.html', value5: 'evaend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 5},
      { selection: 'evachoice4c', label: 'In my pocket', value1: 'evachoice4c.mp4', value2: 'evacog4-1.html', value3: 'eva4c-2.mp4', value4: 'evacog4-2.html', value5: 'evaend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 5}

    ];
    
    //Send HTML video player API to player service
    this.onPlayerReady = function(API){
      videoPlaylist.API = API;
      videoPlaylist.onPlayerReady();
    }
      
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/Eva/";
    videoPlaylist.dataSet = evaPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected) {
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.rollover = function(e){
      console.log(e.target.classList[0]);
      //Use a little jQuery to toggle the touch state
      $("."+e.target.classList[0]).toggleClass(e.target.classList[0]+"_over");
    }
  })
    

  .controller('haileyCtrl', function($scope, videoPlaylist){
  var haileyPaths = [
    { selection: 'opening', value1: 'haileyopen.mp4', value2: 'haileychoice1.html', thisaction: 'timestamp', marker: 'Hailey', steps: 2},
    
    { selection: 'haileychoice1a', label: 'Mmm', value1: 'haileychoice1a.mp4', value2: 'haileychoice2.html', thisaction: 'increment', marker: 'Choice1', steps: 2},
    { selection: 'haileychoice1b', label: 'Turn into a frog', value1: 'haileychoice1b.mp4', value2: 'haileycog1.html', value3: 'haileyend1bc.mp4', redirect: 'haileychoice1a', thisaction: 'increment', marker: 'Choice1', steps: 3},
    { selection: 'haileychoice1c', label: 'Second kiss on my terms', value1: 'haileychoice1c.mp4', value2: 'haileycog1.html', value3: 'haileyend1bc.mp4', redirect: 'haileychoice1a', thisaction: 'increment', marker: 'Choice1', steps: 3},
    
    { selection: 'haileychoice2a', label: 'Okay', value1: 'haileychoice2a.mp4', value2: 'haileychoice3.html', thisaction: 'increment', marker: 'Choice2', steps: 2},
    { selection: 'haileychoice2b', label: 'Rather hear your guitar', value1: 'haileychoice2b.mp4', value2: 'haileycog2.html', value3: 'haileyend2bc.mp4', redirect: 'haileychoice2a', thisaction: 'increment', marker: 'Choice2', steps: 3},
    { selection: 'haileychoice2c', label: 'Im good where we are', value1: 'haileychoice2c.mp4', value2: 'haileycog2.html', value3: 'haileyend2bc.mp4', redirect: 'haileychoice2a', thisaction: 'increment', marker: 'Choice2', steps: 3},
    
    { selection: 'haileychoice3a', label: 'Okay', value1: 'haileychoice3a.mp4', value2: 'haileychoice4.html', thisaction: 'increment', marker: 'Choice3', steps: 2},
    { selection: 'haileychoice3b', label: 'Not tonight', value1: 'haileychoice3b.mp4', value2: 'haileycog3.html', value3: 'haileyend3bc.mp4', redirect: 'haileychoice3a', thisaction: 'increment', marker: 'Choice3', steps: 3},
    { selection: 'haileychoice3c', label: 'Just make out', value1: 'haileychoice3c.mp4', value2: 'haileycog3.html', value3: 'haileyend3bc.mp4', redirect: 'haileychoice3a', thisaction: 'increment', marker: 'Choice3', steps: 3},
    
    { selection: 'haileychoice4a', label: 'Do you have one', value1: 'haileychoice4a.mp4', value2: 'haileychoice4b.mp4', value3: 'haileycog4-1.html', value4: 'hailey4b-2.mp4', value5: 'haileycog4-2.html', value6: 'haileyend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 6},
    { selection: 'haileychoice4b', label: 'Im prepared', value1: 'haileychoice4b.mp4', value2: 'haileycog4-1.html', value3: 'hailey4b-2.mp4', value4: 'haileycog4-2.html', value5: 'haileyend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 5},
    { selection: 'haileychoice4c', label: 'Guess what I have?', value1: 'haileychoice4c.mp4', value2: 'haileycog4-1.html', value3: 'hailey4c-2.mp4', value4: 'haileycog4-2.html', value5: 'haileyend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 5}

  ];

    //Send HTML video player API to player service
    this.onPlayerReady = function(API){
      videoPlaylist.API = API;
      videoPlaylist.onPlayerReady();
    }
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/Hailey/";
    videoPlaylist.dataSet = haileyPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.rollover = function(e){
      console.log(e.target.classList[0]);
      //Use a little jQuery to toggle the touch state
      $("."+e.target.classList[0]).toggleClass(e.target.classList[0]+"_over");
    }

  })

  .controller('isabelCtrl', function($scope, videoPlaylist){

  var isabelPaths = [
    { selection: 'opening', value1: 'isabelopen.mp4', value2: 'isabelchoice1.html', thisaction: 'timestamp', marker: 'Isabel', steps: 2},
    
    { selection: 'isabelchoice1a', label: 'Okay', value1: 'isabelchoice1a.mp4', value2: 'isabelchoice2.html', thisaction: 'increment', marker: 'Choice1', steps: 2},
    { selection: 'isabelchoice1b', label: 'Told Lauren Id help', value1: 'isabelchoice1b.mp4', value2: 'isabelcog1.html', value3: 'isabelend1bc.mp4', redirect: 'isabelchoice1a', thisaction: 'increment', marker: 'Choice1', steps: 3},
    { selection: 'isabelchoice1c', label: 'Lets stay here', value1: 'isabelchoice1c.mp4', value2: 'isabelcog1.html', value3: 'isabelend1bc.mp4', redirect: 'isabelchoice1a', thisaction: 'increment', marker: 'Choice1', steps: 3},
    
    { selection: 'isabelchoice2a', label: 'Me too', value1: 'isabelchoice2a.mp4', value2: 'isabelchoice3.html', thisaction: 'increment', marker: 'Choice2', steps: 2},
    { selection: 'isabelchoice2b', label: 'I dont feel like it', value1: 'isabelchoice2b.mp4', value2: 'isabelcog2.html', value3: 'isabelend2bc.mp4', redirect: 'isabelchoice2a', thisaction: 'increment', marker: 'Choice2', steps: 3},
    { selection: 'isabelchoice2c', label: 'Things will go too far', value1: 'isabelchoice2c.mp4', value2: 'isabelcog2.html', value3: 'isabelend2bc.mp4', redirect: 'isabelchoice2a', thisaction: 'increment', marker: 'Choice2', steps: 3},
    
    { selection: 'isabelchoice3a', label: 'I heard that too', value1: 'isabelchoice3a.mp4', value2: 'isabelchoice4.html', thisaction: 'increment', marker: 'Choice3', steps: 2},
    { selection: 'isabelchoice3b', label: 'Did we make up?', value1: 'isabelchoice3b.mp4', value2: 'isabelcog3.html', value3: 'isabelend3bc.mp4', redirect: 'isabelchoice3a', thisaction: 'increment', marker: 'Choice3', steps: 3},
    { selection: 'isabelchoice3c', label: 'Keep doing this', value1: 'isabelchoice3c.mp4', value2: 'isabelcog3.html', value3: 'isabelend3bc.mp4', redirect: 'isabelchoice3a', thisaction: 'increment', marker: 'Choice3', steps: 3},
    
    { selection: 'isabelchoice4a', label: 'Do you have a condom?', value1: 'isabelchoice4a.mp4', value2: 'isabelchoice4b.mp4', value3: 'isabelcog4-1.html', value4: 'isabel4b-2.mp4', value5: 'isabelcog4-2.html', value6: 'isabelend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 6},
    { selection: 'isabelchoice4b', label: 'I have a condom', value1: 'isabelchoice4b.mp4', value2: 'isabelcog4-1.html', value3: 'isabel4b-2.mp4', value4: 'isabelcog4-2.html', value5: 'isabelend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 5},
    { selection: 'isabelchoice4c', label: 'Got a condom today', value1: 'isabelchoice4c.mp4', value2: 'isabelcog4-1.html', value3: 'isabel4c-2.mp4', value4: 'isabelcog4-2.html', value5: 'isabelend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 5}

  ];

    //Send HTML video player API to player service
    this.onPlayerReady = function(API){
      videoPlaylist.API = API;
      videoPlaylist.onPlayerReady();
    }
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/Isabel/";
    videoPlaylist.dataSet = isabelPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.rollover = function(e){
      console.log(e.target.classList[0]);
      //Use a little jQuery to togle the touch state
      $("."+e.target.classList[0]).toggleClass(e.target.classList[0]+"_over");
    }

  })

  .controller('laurenCtrl', function($scope, videoPlaylist){

  var laurenPaths = [
    { selection: 'opening', value1: 'laurenopen.mp4', value2: 'laurenchoice1.html', thisaction: 'timestamp', marker: 'Lauren', steps: 2},
    
    { selection: 'laurenchoice1a', label: 'Okay', value1: 'laurenchoice1a.mp4', value2: 'laurenchoice2.html', thisaction: 'increment', marker: 'Choice1', steps: 2},
    { selection: 'laurenchoice1b', label: 'Go get the food', value1: 'laurenchoice1b.mp4', value2: 'laurencog1.html', value3: 'laurenend1bc.mp4', redirect: 'laurenchoice1a', thisaction: 'increment', marker: 'Choice1', steps: 3},
    { selection: 'laurenchoice1c', label: 'I should stay here', value1: 'laurenchoice1c.mp4', value2: 'laurencog1.html', value3: 'laurenend1bc.mp4', redirect: 'laurenchoice1a', thisaction: 'increment', marker: 'Choice1', steps: 3},
    
    { selection: 'laurenchoice2a', label: 'Okay', value1: 'laurenchoice2a.mp4', value2: 'laurenchoice3.html', thisaction: 'increment', marker: 'Choice2', steps: 2},
    { selection: 'laurenchoice2b', label: 'Im not ready', value1: 'laurenchoice2b.mp4', value2: 'laurencog2.html', value3: 'laurenend2bc.mp4', redirect: 'laurenchoice2a', thisaction: 'increment', marker: 'Choice2', steps: 3},
    { selection: 'laurenchoice2c', label: 'We got carried away', value1: 'laurenchoice2c.mp4', value2: 'laurencog2.html', value3: 'laurenend2bc.mp4', redirect: 'laurenchoice2a', thisaction: 'increment', marker: 'Choice2', steps: 3},
    
    { selection: 'laurenchoice3a', label: 'Im ready', value1: 'laurenchoice3a.mp4', value2: 'laurenchoice4.html', thisaction: 'increment', marker: 'Choice3', steps: 2},
    { selection: 'laurenchoice3b', label: 'I dont want to rush into something', value1: 'laurenchoice3b.mp4', value2: 'laurencog3.html', value3: 'laurenend3bc.mp4', redirect: 'laurenchoice3a', thisaction: 'increment', marker: 'Choice3', steps: 3},
    { selection: 'laurenchoice3c', label: 'Keep doing this', value1: 'laurenchoice3c.mp4', value2: 'laurencog3.html', value3: 'laurenend3bc.mp4', redirect: 'laurenchoice3a', thisaction: 'increment', marker: 'Choice3', steps: 3},
    
    { selection: 'laurenchoice4a', label: 'Do you have one?', value1: 'laurenchoice4a.mp4', value2: 'laurenchoice4b.mp4', value3: 'laurencog4-1.html', value4: 'lauren4b-2.mp4', value5: 'laurencog4-2.html', value6: 'laurenend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 6},
    { selection: 'laurenchoice4b', label: 'I have one', value1: 'laurenchoice4b.mp4', value2: 'laurencog4-1.html', value3: 'lauren4b-2.mp4', value4: 'laurencog4-2.html', value5: 'laurenend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 5},
    { selection: 'laurenchoice4c', label: 'Have one just in case', value1: 'laurenchoice4c.mp4', value2: 'laurencog4-1.html', value3: 'lauren4c-2.mp4', value4: 'laurencog4-2.html', value5: 'laurenend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 5}

  ];

    //Send HTML video player API to player service
    this.onPlayerReady = function(API){
      videoPlaylist.API = API;
      videoPlaylist.onPlayerReady();
    }
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/Lauren/";
    videoPlaylist.dataSet = laurenPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.rollover = function(e){
      console.log(e.target.classList[0]);
      //Use a little jQuery to togle the touch state
      $("."+e.target.classList[0]).toggleClass(e.target.classList[0]+"_over");
    }
  })

  .controller('mayaCtrl', function($scope, videoPlaylist){

  var mayaPaths = [
    { selection: 'opening', value1: 'mayaopen.mp4', value2: 'mayachoice1.html', thisaction: 'timestamp', marker: 'Maya', steps: 2},
    
    { selection: 'mayachoice1a', label: 'Okay', value1: 'mayachoice1a.mp4', value2: 'mayachoice2.html', thisaction: 'increment', marker: 'Choice1', steps: 2},
    { selection: 'mayachoice1b', label: 'You can handle it', value1: 'mayachoice1b.mp4', value2: 'mayacog1.html', value3: 'mayaend1bc.mp4', redirect: 'mayachoice1a', thisaction: 'increment', marker: 'Choice1', steps: 3},
    { selection: 'mayachoice1c', label: 'You go ahead', value1: 'mayachoice1c.mp4', value2: 'mayacog1.html', value3: 'mayaend1bc.mp4', redirect: 'mayachoice1a', thisaction: 'increment', marker: 'Choice1', steps: 3},
    
    { selection: 'mayachoice2a', label: 'That feels nice', value1: 'mayachoice2a.mp4', value2: 'mayachoice3.html', thisaction: 'increment', marker: 'Choice2', steps: 2},
    { selection: 'mayachoice2b', label: 'Thats far enough', value1: 'mayachoice2b.mp4', value2: 'mayacog2.html', value3: 'mayaend2bc.mp4', redirect: 'mayachoice2a', thisaction: 'increment', marker: 'Choice2', steps: 3},
    { selection: 'mayachoice2c', label: 'You need a time out', value1: 'mayachoice2c.mp4', value2: 'mayacog2.html', value3: 'mayaend2bc.mp4', redirect: 'mayachoice2a', thisaction: 'increment', marker: 'Choice2', steps: 3},
    
    { selection: 'mayachoice3a', label: 'Lets do it', value1: 'mayachoice3a.mp4', value2: 'mayachoice4.html', thisaction: 'increment', marker: 'Choice3', steps: 2},
    { selection: 'mayachoice3b', label: 'I like what were doing', value1: 'mayachoice3b.mp4', value2: 'mayacog3.html', value3: 'mayaend3bc.mp4', redirect: 'mayachoice3a', thisaction: 'increment', marker: 'Choice3', steps: 3},
    { selection: 'mayachoice3c', label: 'This isnt the right time', value1: 'mayachoice3c.mp4', value2: 'mayacog3.html', value3: 'mayaend3bc.mp4', redirect: 'mayachoice3a', thisaction: 'increment', marker: 'Choice3', steps: 3},
    
    { selection: 'mayachoice4a', label: 'Do you have a condom?', value1: 'mayachoice4a.mp4', value2: 'mayachoice4b.mp4', value3: 'mayacog4-1.html', value4: 'maya4b-2.mp4', value5: 'mayacog4-2.html', value6: 'mayaend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 6},
    { selection: 'mayachoice4b', label: 'I have one', value1: 'mayachoice4b.mp4', value2: 'mayacog4-1.html', value3: 'maya4b-2.mp4', value4: 'mayacog4-2.html', value5: 'mayaend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 5},
    { selection: 'mayachoice4c', label: 'Condom in my purse', value1: 'mayachoice4c.mp4', value2: 'mayacog4-1.html', value3: 'maya4c-2.mp4', value4: 'mayacog4-2.html', value5: 'mayaend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 5}

  ];

    //Send HTML video player API to player service
    this.onPlayerReady = function(API){
      videoPlaylist.API = API;
      videoPlaylist.onPlayerReady();
    }
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/Maya/";
    videoPlaylist.dataSet = mayaPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.rollover = function(e){
      console.log(e.target.classList[0]);
      //Use a little jQuery to togle the touch state
      $("."+e.target.classList[0]).toggleClass(e.target.classList[0]+"_over");
    }
  })

  .controller('nickiCtrl', function($scope, videoPlaylist){

  var nickiPaths = [
    { selection: 'opening', value1: 'nickiopen.mp4', value2: 'nickichoice1.html', thisaction: 'timestamp', marker: 'Nicki', steps: 2},
    
    { selection: 'nickichoice1a', label: 'Okay', value1: 'nickichoice1a.mp4', value2: 'nickichoice2.html', thisaction: 'increment', marker: 'Choice1', steps: 2},
    { selection: 'nickichoice1b', label: 'We hardly hang out', value1: 'nickichoice1b.mp4', value2: 'nickicog1.html', value3: 'nickiend1bc.mp4', redirect: 'nickichoice1a', thisaction: 'increment', marker: 'Choice1', steps: 3},
    { selection: 'nickichoice1c', label: 'Whats my name?', value1: 'nickichoice1c.mp4', value2: 'nickicog1.html', value3: 'nickiend1bc.mp4', redirect: 'nickichoice1a', thisaction: 'increment', marker: 'Choice1', steps: 3},
    
    { selection: 'nickichoice2a', label: 'Lets go', value1: 'nickichoice2a.mp4', value2: 'nickichoice3.html', thisaction: 'increment', marker: 'Choice2', steps: 2},
    { selection: 'nickichoice2b', label: 'Not so fast', value1: 'nickichoice2b.mp4', value2: 'nickicog2.html', value3: 'nickiend2bc.mp4', redirect: 'nickichoice2a', thisaction: 'increment', marker: 'Choice2', steps: 3},
    { selection: 'nickichoice2c', label: 'I told Lauren', value1: 'nickichoice2c.mp4', value2: 'nickicog2.html', value3: 'nickiend2bc.mp4', redirect: 'nickichoice2a', thisaction: 'increment', marker: 'Choice2', steps: 3},
    
    { selection: 'nickichoice3a', label: 'I want you too', value1: 'nickichoice3a.mp4', value2: 'nickichoice4.html', thisaction: 'increment', marker: 'Choice3', steps: 2},
    { selection: 'nickichoice3b', label: 'Im not ready', value1: 'nickichoice3b.mp4', value2: 'nickicog3.html', value3: 'nickiend3bc.mp4', redirect: 'nickichoice3a', thisaction: 'increment', marker: 'Choice3', steps: 3},
    { selection: 'nickichoice3c', label: 'Moving too fast', value1: 'nickichoice3c.mp4', value2: 'nickicog3.html', value3: 'nickiend3bc.mp4', redirect: 'nickichoice3a', thisaction: 'increment', marker: 'Choice3', steps: 3},
    
    { selection: 'nickichoice4a', label: 'Do you have a condom?', value1: 'nickichoice4a.mp4', value2: 'nickichoice4b.mp4', value3: 'nickicog4-1.html', value4: 'nicki4b-2.mp4', value5: 'nickicog4-2.html', value6: 'nickiend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 6},
    { selection: 'nickichoice4b', label: 'I have a condom', value1: 'nickichoice4b.mp4', value2: 'nickicog4-1.html', value3: 'nicki4b-2.mp4', value4: 'nickicog4-2.html', value5: 'nickiend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 5},
    { selection: 'nickichoice4c', label: 'Condom carrier', value1: 'nickichoice4c.mp4', value2: 'nickicog4-1.html', value3: 'nicki4c-2.mp4', value4: 'nickicog4-2.html', value5: 'nickiend4bc.mp4', thisaction: 'increment', marker: 'Choice4', steps: 5}

  ];

    //Send HTML video player API to player service
    this.onPlayerReady = function(API){
      videoPlaylist.API = API;
      videoPlaylist.onPlayerReady();
    }
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/Nicki/";
    videoPlaylist.dataSet = nickiPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.rollover = function(e){
      console.log(e.target.classList[0]);
      //Use a little jQuery to togle the touch state
      $("."+e.target.classList[0]).toggleClass(e.target.classList[0]+"_over");
    }

  })


  .controller('bonfireCtrl', function($scope, $filter, $state, localStorageService){
    var bonfirePaths = [
    { selection: 'eva', value: 'app.eva'},
    { selection: 'hailey', value: 'app.hailey'},
    { selection: 'isabel', value: 'app.isabel'},
    { selection: 'lauren', value: 'app.lauren'},
    { selection: 'maya', value: 'app.maya'},
    { selection: 'nicki', value: 'app.nicki'}
    ];

   localStorageService.set('app_position', 'bonfire');

   $scope.menuSelection = function(selected) {
     //search array for selection and return view
     filterElement = $filter('filter')(bonfirePaths, { selection: selected })[0];
     $state.go(filterElement.value);
   };
  })

  .controller('timelineCtrl', function($scope, videoPlaylist, $element) {  
    var openPaths = [
    { selection: 'opening', label: 'Opening sequence', value1: 'open1.mp4', value2: 'opencog1.html', value3: 'open2.mp4' ,value4: 'open2.html' ,value5: 'open3.mp4' ,value6: 'open3.html' , value7: 'open4noquit.mp4', redirect: 'app.bonfire', redirectView: true, steps: 7 }
  ];

    //Send HTML video player API to player service
    this.onPlayerReady = function(API){
      videoPlaylist.API = API;
      videoPlaylist.onPlayerReady();
    }
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/Open/";
    videoPlaylist.dataSet = openPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.rollover = function(e){
      console.log(e.target.classList[0]);
      //Use a little jQuery to togle the touch state
      $("."+e.target.classList[0]).toggleClass(e.target.classList[0]+"_over");
    }

  })

  .controller('timelineOutCtrl', function($scope, videoPlaylist) {  
    var closePaths = [
    { selection: 'opening', value1: 'wrapup1.mp4', value2: 'wrapup2.mp4', value3: 'lastscene.mp4', value4: 'credits.mp4', value5: 'jessicasroom.mp4', redirect: 'app.jessica', redirectView: true, steps:5 }
  ];

    //Send HTML video player API to player service
    this.onPlayerReady = function(API){
      videoPlaylist.API = API;
      videoPlaylist.onPlayerReady();
    }
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/Open/";
    videoPlaylist.dataSet = closePaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }

  })

  .controller('jessicaCtrl', function($scope,$rootScope,$state, localStorageService,videoPlaylist){

    localStorageService.set('app_position', 'jessica');
    localStorageService.set('jessica_room', true);
    $rootScope.$broadcast('jessicaRoom', null);

    var jessicaPaths = [
    { selection: 'opening', label: 'Jessica Menu', value1: 'jessicamenu.html', steps: 1},
    { selection: 'jessicachoice1a', label: 'Going to the gynecologist', value1: 'gyneexam.mp4', value2: 'gynecog1.mp4', value3: 'gynecog1.html', value4: 'gynecog2.mp4', value5: 'gynecog2.html', redirect: 'opening', steps: 5},
    { selection: 'jessicachoice1b', label: 'I got birth control and so can you', value1: 'bcintro.mp4', value2: 'bccog1.mp4', value3: 'bccog1.html', value4: 'bccog2.mp4', value5: 'bccog2.html', value6: 'bccog3.mp4', value7: 'bccog3.html', redirect: 'app.birthcontrol', redirectView: true, steps: 7},
    { selection: 'jessicachoice1c', label: 'Know your body', value1: 'kyb.mp4', redirect: 'app.kyb', redirectView: true, steps: 1},
    { selection: 'jessicachoice1d', label: 'Watch out for STis', value1: 'riskometer.mp4', redirect: 'app.stimain', redirectView: true, thisaction: 'timestamp', marker: 'STI', steps: 1},
    { selection: 'jessicachoice1e', label: 'Haileys condom dos and donts', value1: 'open2-jessicasroom.mp4', value2: 'opencog2.html', value3: 'open3.mp4', value4: 'opencog3.html', value5: 'open4-jessicasroom.mp4', redirect: 'opening', steps: 5},
    { selection: 'jessicachoice1f', label: 'Jessica and her friends', value1: 'open4quit-jessicasroom.mp4', redirect: 'app.bonfire', redirectView: true, steps: 1}
    ];
    
    //Send HTML video player API to player service
    this.onPlayerReady = function(API){
      videoPlaylist.API = API;
      videoPlaylist.onPlayerReady();
    }
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/Jessica/";
    videoPlaylist.dataSet = jessicaPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.startOver = function(){
      $state.go('app.start');
    }
  })


  .controller('birthCtrl', function($scope, videoPlaylist, $state, localStorageService){

  localStorageService.set('app_position', 'birthcontrol');

  var bcPaths = [
    { selection: 'opening', value1: 'bcmain.html', thisaction: 'timestamp', marker: 'BC', steps:1 },
    { selection: 'bc1a', value1: 'ec.mp4', redirect: 'opening', thisaction: 'increment', marker: 'BCdetail', steps:1},
    { selection: 'bc1b', value1: 'thepill.mp4', redirect: 'opening', thisaction: 'increment', marker: 'BCdetail', steps:1},
    { selection: 'bc1c', value1: 'depo.mp4', redirect: 'opening', thisaction: 'increment', marker: 'BCdetail', steps:1},
    { selection: 'bc1d', value1: 'nuva.mp4', redirect: 'opening', thisaction: 'increment', marker: 'BCdetail', steps:1},
    { selection: 'bc1e', value1: 'patch.mp4', redirect: 'opening', thisaction: 'increment', marker: 'BCdetail', steps:1},
    { selection: 'bc1f', value1: 'condoms.mp4', redirect: 'opening', thisaction: 'increment', marker: 'BCdetail', steps:1},
    { selection: 'bc1g', value1: 'implant.mp4', redirect: 'opening', thisaction: 'increment', marker: 'BCdetail', steps:1},
    { selection: 'bc1h', value1: 'iud.mp4', redirect: 'opening', thisaction: 'increment', marker: 'BCdetail', steps:1},
    { selection: 'bc1i', value1: 'othermethods.mp4', redirect: 'opening', thisaction: 'increment', marker: 'BCdetail', steps:1},
    ];
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/Jessica/";
    videoPlaylist.dataSet = bcPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.goBack = function(){
      $state.go('app.jessica');
    }
  })


  .controller('stiMainCtrl', function($scope, videoPlaylist, $state, localStorageService){

    localStorageService.set('app_position', 'stimain');

    var stiPaths = [
      { selection: 'opening', value1: 'sti-main.html', steps:1 },
      { selection: 'stimn1a', value1: 'whatcausesstis.mp4', redirect: 'app.sticause', redirectView: true, thisaction: 'increment', marker: 'STIdetail', steps:1},
      { selection: 'stimn2a', value1: 'howdoyouknow.mp4', redirect: 'app.stiid', redirectView: true, thisaction: 'increment', marker: 'STIdetail', steps:1},
      { selection: 'stimn3a', value1: 'howdoyouget.mp4', redirect: 'app.stiget', redirectView: true, thisaction: 'increment', marker: 'STIdetail', steps:1},
      { selection: 'stimn4a', value1: 'whatifyouhave.mp4', redirect: 'app.stitreat', redirectView: true, thisaction: 'increment', marker: 'STIdetail', steps:1},
      { selection: 'stimn5a', value1: 'whataresymptoms.mp4', redirect: 'app.stisymp', redirectView: true, thisaction: 'increment', marker: 'STIdetail', steps:1},
      { selection: 'stimn6a', value1: 'mainstis.mp4', redirect: 'app.stiwhat', redirectView: true, thisaction: 'increment', marker: 'STIdetail', steps:1},
      { selection: 'stimn7a', value1: 'plushies.mp4', redirect: 'app.stifull', redirectView: true, thisaction: 'increment', marker: 'STIdetail', steps:1}
      ];
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/STIs/";
    videoPlaylist.dataSet = stiPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.goBack = function(){
      $state.go('app.jessica');
    }
  })

  .controller('kybMainCtrl', function($scope, videoPlaylist, $state, localStorageService){

    localStorageService.set('app_position', 'kybmain');

    var stiPaths = [
      { selection: 'opening', value1: 'kyb.html', steps:1 },
      { selection: 'kyb1', value1: 'labia.mp4', redirect: 'opening', steps:1},
      { selection: 'kyb2', value1: 'urethra.mp4', redirect: 'opening', steps:1},
      { selection: 'kyb3', value1: 'vulva.mp4', redirect: 'opening', steps:1},
      { selection: 'kyb4', value1: 'clitoris.mp4', redirect: 'opening', steps:1},
      { selection: 'kyb5', value1: 'labia.mp4', redirect: 'opening', steps:1},
      { selection: 'kyb6', value1: 'fallopian_tubes.mp4', redirect: 'opening', steps:1},
      { selection: 'kyb7', value1: 'ovaries.mp4', redirect: 'opening', steps:1},
      { selection: 'kyb8', value1: 'uterus.mp4', redirect: 'opening', steps:1},
      { selection: 'kyb9', value1: 'cervix.mp4', redirect: 'opening', steps:1},
      { selection: 'kyb10', value1: 'vagina.mp4', redirect: 'opening', steps:1},
    ];

    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/know_your_body/";
    videoPlaylist.dataSet = stiPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.goBack = function(){
      $state.go('app.jessica');
    }
  })


  .controller('stiCauseCtrl', function($scope, videoPlaylist, $state){
  var stiPaths = [
    { selection: 'opening', value1: 'stis.html', steps:1 },
    { selection: 'stic1a', value1: 'herpes-cause.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stic2a', value1: 'gonorrhea-cause.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stic3a', value1: 'chlamydia-cause.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stic4a', value1: 'trich-cause.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stic5a', value1: 'hepatitis-cause.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stic6a', value1: 'syphilis-cause.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stic7a', value1: 'hpv-cause.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stic8a', value1: 'hiv-cause.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1}
    ];
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/STIs/";
    videoPlaylist.dataSet = stiPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.goBack = function(){
      //Refresh current state
      $state.go('app.stimain');
    }
  })

.controller('stiIdCtrl', function($scope, videoPlaylist, $state){
  var stiPaths = [
    { selection: 'opening', value1: 'stis.html', steps:1 },
    { selection: 'stiId1a', value1: 'herpes-id.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiId2a', value1: 'gonorrhea-id.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiId3a', value1: 'chlamydia-id.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiId4a', value1: 'trich-id.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiId5a', value1: 'hepatitis-id.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiId6a', value1: 'syphilis-id.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiId7a', value1: 'hpv-id.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiId8a', value1: 'hiv-id.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1}
    ];
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/STIs/";
    videoPlaylist.dataSet = stiPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.goBack = function(){
      //Refresh current state
      $state.go('app.stimain');
    }
  })

.controller('stiGetCtrl', function($scope, videoPlaylist, $state){
  var stiPaths = [
    { selection: 'opening', value1: 'stis.html', steps:1 },
    { selection: 'stiGet1a', value1: 'herpes-get.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiGet2a', value1: 'gonorrhea-get.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiGet3a', value1: 'chlamydia-get.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiGet4a', value1: 'trich-get.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiGet5a', value1: 'hepatitis-get.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiGet6a', value1: 'syphilis-get.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiGet7a', value1: 'hpv-get.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiGet8a', value1: 'hiv-get.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1}
    ];
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/STIs/";
    videoPlaylist.dataSet = stiPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.goBack = function(){
      //Refresh current state
      $state.go('app.stimain');
    }
  })

.controller('stiTreatCtrl', function($scope, videoPlaylist, $state){
  var stiPaths = [
    { selection: 'opening', value1: 'stis.html', steps:1 },
    { selection: 'stiTreat1a', value1: 'herpes-treat.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiTreat2a', value1: 'gonorrhea-treat.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiTreat3a', value1: 'chlamydia-treat.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiTreat4a', value1: 'trich-treat.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiTreat5a', value1: 'hepatitis-treat.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiTreat6a', value1: 'syphilis-treat.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiTreat7a', value1: 'hpv-treat.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiTreat8a', value1: 'hiv-treat.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1}
    ];
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/STIs/";
    videoPlaylist.dataSet = stiPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.goBack = function(){
      //Refresh current state
      $state.go('app.stimain');
    }
  })

.controller('stiSympCtrl', function($scope, videoPlaylist, $state){
  var stiPaths = [
    { selection: 'opening', value1: 'stis.html', steps:1 },
    { selection: 'stiSymp1a', value1: 'herpes-symp.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiSymp2a', value1: 'gonorrhea-symp.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiSymp3a', value1: 'chlamydia-symp.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiSymp4a', value1: 'trich-symp.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiSymp5a', value1: 'hepatitis-symp.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiSymp6a', value1: 'syphilis-symp.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiSymp7a', value1: 'hpv-symp.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiSymp8a', value1: 'hiv-symp.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1}
    ];
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/STIs/";
    videoPlaylist.dataSet = stiPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.goBack = function(){
      //Refresh current state
      $state.go('app.stimain');
    }
  })

.controller('stiWhatCtrl', function($scope, videoPlaylist, $state){
  var stiPaths = [
    { selection: 'opening', value1: 'stis.html', steps:1 },
    { selection: 'stiWhat1a', value1: 'herpes.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiWhat2a', value1: 'gonorrhea.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiWhat3a', value1: 'chlamydia.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiWhat4a', value1: 'trich.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiWhat5a', value1: 'hepatitis.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiWhat6a', value1: 'syphilis.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiWhat7a', value1: 'hpv.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1},
    { selection: 'stiWhat8a', value1: 'hiv.mp4', redirect: 'opening', thisaction: 'increment', marker: 'STIdetail', steps:1}
    ];
    
    //Start opening movie and setup video path
    this.config = videoPlaylist.config;
    videoPlaylist.vidUrl = "http://dashboard.seventeendays.org/files/seventeendays/STIs/";
    videoPlaylist.dataSet = stiPaths;
    $scope.positionInTime = videoPlaylist.choosePath('opening');

    
    //Get selection from user and find next movie
    $scope.moveTimeline = function(selected) {
      if(selected){
        $scope.positionInTime = videoPlaylist.choosePath(selected);
      }else{
        //Advance without new selection
        videoPlaylist.advance();
      }
    }
    
    //Advance on movie end
    this.onCompleteVideo = function(){
      videoPlaylist.advance();
    }
    
    $scope.goBack = function(){
      //Refresh current state
      $state.go('app.stimain');
    }
  })
