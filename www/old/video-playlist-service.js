angular.module('seventeendays').service('videoPlaylist', function($state, $filter, tracking, $rootScope){
  //Set default values
  this.pos = {};
  this.total = 0;
  this.count = 1;
  this.vidUrl = null;
  this.dataSet = null;
  this.state = null;
  this.API = {};

  this.choosePath = function(selected){
    //search array for selection and return object
    this.getPath = $filter('filter')(this.dataSet, { selection: selected })[0];
    //get first value from returned object
    tracking.choice({save_point:this.getPath.value2, thisaction:this.getPath.thisaction, marker:this.getPath.marker});
    this.pos.value = this.getPath.value1;
    this.total = this.getPath.steps;
    this.count = 1;
    this.pos.type = this.pos.value.split(".")[1];
      if(this.pos.type == 'mp4'){
        //Add url to the beginning of movie files
        this.config.sources = [{src: this.vidUrl+this.pos.value, type: "video/mp4"}];
          if(this.API.isReady){
            this.API.play();
          };
      }
    return this.pos;
  }

  this.advance = function() {
      if(this.count < this.total){
        this.count++;
        this.pos.value = this.getPath['value'+this.count];
        tracking.pos(this.pos.value);
        //Check whether the current item is html or mp4
        this.pos.type = this.pos.value.split(".")[1];
        console.log(this.pos.value);
        if(this.pos.type == 'mp4'){
          //Add url to the beginning of movie files
          this.config.sources = [{src: this.vidUrl+this.pos.value, type: "video/mp4"}];
          if(this.API.isReady){
            this.API.play();
          }
        }
      }else{
        //Transition to next alternate storyline
        if(this.getPath.redirect){
          if(this.getPath.redirectView){
            //go to another view
            $state.go(this.getPath.redirect);
          }else{
            this.choosePath(this.getPath.redirect);
          }
        }else{
        //go to another view
          $state.go('app.end');
        }
      }
  };

  this.onPlayerReady = function() {
    // if(this.API.currentState != 'play'){
    //  //Force play if autoplay doesn't work
    //  this.API.play();
    //  this.API.currentState = 'play';
    // }
  };

  this.config = {
    preload: "metadata",
    autoHide: false,
    autoHideTime: 3000,
    autoPlay: true,
    sources: null,
    responsive: true,
    inline: true,
    autohide: true,
    autohideTime: 3200,
    theme: {
      url: "lib/videogular-themes-default/videogular.min.css"
      },
      plugins: {
        //plugins go here
      }
  };
});
