angular.module('rtcommMobile.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('VideoCtrl', function($scope, $log, RtcommService,Config){

  // Load the Config when initializing and set it on the RtcommService
  var init = function() {
    $log.debug('Applying Config ', Config.config);
  };

  // Assign some variables for the UI
  $scope.videoElement = document.getElementById('videoContainer');
  $scope.connected = false;
  $scope.configurationWasSet = false;
  $scope.videoActiveEndpointUUID = null;
  $scope.sessionStarted = false;
  var callEndpoint = 'noCall';
  var peerUserId = 'noCall';
  var accepted = false;
  $scope.messageFromCamera="No Camera Report";

  // Called on something changed, needed for the phonertc plugin
  $scope.updatePosition = function updatePosition() {
    cordova.plugins.phonertc.setVideoView({
      container: $scope.videoElement,
      local: {
      position: [20, 20],
           size: [1, 1]
          }
        });
   };
   
   $scope.$on('newendpoint', function (event, endpointUUID){
		RtcommService.setActiveEndpoint(endpointUUID);
   });
    
	// The "session:alerting" event is received when incoming AV call initated by remote used, and this is the place to 
	// accept or deny the call.
   $scope.$on('session:alerting', function (event, endpointUUID){
        if (confirm("Accept incoming video from Cam1 ?")) {
            console.log( "session:alerting event");
			accepted = true;
        }      
   });
  
  // The "session:started" event is received when incoming call received from the peer.        
   $scope.$on('session:started', function (event, endpointUUID){
		$log.debug('session:started' + endpointUUID);
		if(callEndpoint == 'noCall'){ // this is an incoming call
			callEndpoint = endpointUUID.endpoint.id;
		}
		$scope.messageFromCamera="Stream from Camera 2";
        $scope.sessionStarted = true;
   });
   
   // The "endpointActivated" event is received when incoming connection received from the peer accepted by local user
   // and activated.        
   $scope.$on('endpointActivated', function (event, endpointUUID) {
   //  Not to do something here to show that this button is live.
     $log.debug('Video Ctrl : endpointActivated =' + endpointUUID);
     if (accepted && $scope.videoActiveEndpointUUID !== endpointUUID.id){
       $scope.videoActiveEndpointUUID = endpointUUID.id;
       $scope.endpoint = RtcommService.getEndpoint(endpointUUID.id);
       $scope.endpoint.webrtc.setLocalMedia(
         { mediaIn: $scope.videoElement });
       }
	   $scope.endpoint.webrtc.enable();
	   $scope.endpoint.accept();
       $scope.updatePosition();
   });
      

	// The "webrtc:connected" event is received use successfully registered into MQTT server.         
   $scope.$on('webrtc:connected', function(event,eventObject){
     $scope.connected = true;
     $scope.updatePosition();
   });
    
    $scope.$on('destroyed', function(event,eventObject){
		$log.debug('destroyed' + eventObject);
    });
   
   $scope.$on('webrtc:diconnected', function(event,eventObject){
     $scope.sessionStarted = false;
   });
   
   // The "session:stopped" event is received when session stopped.
   $scope.$on('session:stopped', function(event,eventObject){
	if(callEndpoint != 'noCall'){
		$log.info('session:stopped event. Ending ongoing call '+ callEndpoint);
		$scope.endCall();
	}
    $scope.sessionStarted = false;
   });
   
	$scope.$on('session:failed', function(event,eventObject){
     $scope.sessionStarted = false;
   });

   // 
	$scope.$on('rtcomm::init', function(event,eventObject){
		$scope.messageFromCamera="No Camera Report";
		$scope.connected = eventObject;
	});
            
    // Register button
	$scope.connect = function(id) {
		//id = id || Config.getKey('queue');
		//$log.info('Using ID of: '+id);
		if ($scope.connected) {
			if(callEndpoint != 'noCall'){
				$log.info('End ongoing call with: ' + peerUserId);
        	 	$scope.endCall();
			}
			$scope.disconnect();
			$scope.sessionStarted = false;
			$scope.connected = false;
		} else {			
			$scope.register();
    }
  };
  
  
  // Register yourself in the MQTT server
  $scope.register = function() {
		 $log.debug('Registering');
		 if($scope.configurationWasSet){
			 id = Config.getKey('userid');
			 $log.info('Regitser userID: '+id);
        	 RtcommService.register(id);
		 }
		 else{
			Config.set();
			$scope.configurationWasSet = true;
		 }
   };
   
   // Start / End call with peer. 
    $scope.sessionAction = function(id) {
        if ($scope.sessionStarted) {
            $log.debug('HandUp session ');
			$scope.endCall();
        } 
		else{
			if($scope.connected){
				var person = prompt("Please enter Calle Name", "");
				$scope.placeCall(person);
				$scope.updatePosition();
			}
			else{
				confirm("You should Register first");
			}
		}
    };

	// Disconnect existing ongoing AV call.
	$scope.endCall = function() {
		$log.debug('Ending Call with + ' + peerUserId);
		if(callEndpoint != 'noCall'){
			var endpointToDisconnect = RtcommService.getEndpoint(callEndpoint);
			callEndpoint = 'noCall';
			RtcommService.endCall(endpointToDisconnect);
			$scope.messageFromCamera="No Camera Report";
			peerUserId = 'noCall';
		}
		else{
			$log.debug('No active AV call');
		};
   };
   
   // Disconnect from the MQTT server.
	$scope.disconnect = function() {
		 $log.debug('Disconnecting call for endpoint: ' + $scope.epCtrlActiveEndpointUUID);
		 if($scope.configurationWasSet){
			$log.debug('unregister this user: ' + $scope.epCtrlActiveEndpointUUID);
		 	RtcommService.unregister();
		 }
   };

	$scope.placeCall = function(id){
		var peerUserId = id;
		if (peerUserId) {
			$log.info('Calling ' + peerUserId);
			// We are only going to support video here.
			callEndpoint = RtcommService.placeCall(peerUserId,['webrtc']);
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
