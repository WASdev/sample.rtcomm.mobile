angular.module('rtcommMobile.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('VideoCtrl', function($scope, $log, RtcommService,Config){

  // Load the Config when initializing and set it on the RtcommService
  var init = function() {
    $log.debug('Applying Config ', Config.config);
    Config.set();
  };

  // Assign some variables for the UI
  $scope.videoElement = document.getElementById('videoContainer');
  $scope.connected = false;  
  $scope.videoActiveEndpointUUID = null;

  // Called on something changed, needed for the phonertc plugin
  $scope.updatePosition = function updatePosition() {
    cordova.plugins.phonertc.setVideoView({
      container: $scope.videoElement,
      local: {
       position: [20, 20],
            size: [100, 100]
          }
        });
   };

   $scope.$on('endpointActivated', function (event, endpointUUID) {
   //  Not to do something here to show that this button is live.
     $log.debug('Video Ctrl : endpointActivated =' + endpointUUID);
     if ($scope.videoActiveEndpointUUID !== endpointUUID){
       $scope.videoActiveEndpointUUID = endpointUUID;
       $scope.endpoint = RtcommService.getEndpoint(endpointUUID);
       $scope.endpoint.webrtc.setLocalMedia(
          { mediaIn: $scope.videoElement });
        }
       $scope.updatePosition();
   });
   $scope.$on('webrtc:connected', function(event,eventObject){
     $scope.connected = true;
     $scope.updatePosition();
   });
   $scope.$on('webrtc:diconnected', function(event,eventObject){
     $scope.connected = false;
   });
   $scope.$on('session:stopped', function(event,eventObject){
     $scope.connected = false;
   });

   $scope.$on('session:failed', function(event,eventObject){
     $scope.connected = false;
   });

  $scope.connect = function(id) {
    id = id || Config.getKey('queue');
    $log.info('Using ID of: '+id);
    if ($scope.connected) {
      $scope.disconnect();
    } else {
      $scope.placeCall(id);
      $scope.updatePosition();
    }
  };

	 $scope.disconnect = function() {
		 $log.debug('Disconnecting call for endpoint: ' + $scope.epCtrlActiveEndpointUUID);
		 $scope.endpoint.disconnect();
   };

  $scope.placeCall = function(id){
     var callee = id || $scope.id;
     if (callee) {
       $log.info('Calling '+callee);
       // We are only going to support video here.
       RtcommService.placeCall(callee,['webrtc']);
     } else {
       $log.error('No callee specified...');
     }
  };
  // Init the controller when Loaded!
  init();
})

// Settings controller
.controller('SettingsCtrl', function($scope, Config) {
  $scope.settings = Config.config;
  $scope.set= Config.set;
});
