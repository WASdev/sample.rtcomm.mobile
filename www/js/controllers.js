angular.module('rtcommMobile.controllers', [])
.controller('MasterCtrl', function MasterCtrl($scope, $ionicTabsDelegate,$log, RtcommService, State, $ionicPopup, $ionicPlatform, Settings) {
  $log.debug('------- inited MasterCtrl------------ ');
  //TODO:  We should load settings/connect if its done. (move 'register logic here?');
  $scope.state = State;
  // Define what we want to use for video tags
  RtcommService.setViewSelector('local-video','remote-video');
  // Register if we are configured to register.
  //

	$scope.$on('endpointActivated', function (event, endpointUUID) {
		//	Not to do something here to show that this button is live.
    // Select our tab?
    $ionicTabsDelegate.select(1);
		$log.debug('MasterCtrl: endpointActivated =' + endpointUUID);
		RtcommService.setVideoView(endpointUUID);
	});

  $scope.$on('session:alerting', function(event, object) {
    $log.debug('MasterCtrl: received session:alerting');
    // 1 is video.
    $ionicTabsDelegate.select(1);
    $ionicPopup.confirm({
        title: "Incoming Call",
        template: "Accept incoming call from "+object.endpoint.getRemoteEndpointID(),
    }).then(function(confirmed) { 
      if (confirmed) {
        $log.debug(' -------- MasterCtrl: Accepting Call() -------');
        object.endpoint.accept();
      } else {
        object.endpoint.reject();
      }
    });
  });

  $scope.selectTabWithIndex = function(index) {
    $log.debug('Selecting tab '+index);
    $ionicTabsDelegate.select(index);
  }
})
.controller('DashCtrl', function($scope,$log, State, RtcommService, Settings) {

  // handle some events and log information
   $scope.state = State;
   $scope.settings = Settings.load();
    /*
     *
    var insertEvent = function(event, eventObject) {
      $scope.eventHistory.push(event.name);
      $log.debug('DashCtrl received event: ',event);
      $log.debug('DashCtrl received eventObject: ',eventObject);
//      $scope.eventHistory.push(event event);
    }
    $scope.$on('endpointActivated', insertEvent);
    $scope.$on('session:started', insertEvent);
    $scope.$on('rtcomm::init', insertEvent);
    $scope.$on('queueupdate', insertEvent);
    $scope.$on('rtcomm::alert', insertEvent);
    $scope.$on('session:stopped', insertEvent);
    $scope.$on('session:failed', insertEvent);
    $scope.$on('session:queued', insertEvent);
    $scope.$on('session:alerting', insertEvent);
    $scope.$on('session:trying', insertEvent);
    $scope.$on('session:ringing',insertEvent);
    $scope.$on('noEndpointActivated', insertEvent);
    $scope.$on('webrtc:connected', insertEvent);
    $scope.$on('webrtc:disconnected', insertEvent);
    */
  $scope.action = (State.registered) ? "Unregister" : "Register";

  $scope.register = function() {
    // Do some checking here.
    // if not initialized, initialize...
    $log.debug('Register is:'+$scope.state.registered+' Initialized is: '+RtcommService.isInitialized());
    // If we are not registered...
    //
    if (!$scope.state.registered && !RtcommService.isInitialized() && ($scope.settings.userid !== '')) {
      $log.debug('Registering as:  '+ $scope.settings.userid);
      // Setting the config will invoke Register if we are not registered.
      RtcommService.setConfig($scope.settings);
      //RtcommService.register($scope.settings.userid);
    } else {
      $log.debug('Calling Unregister... ');
      RtcommService.unregister();
    }
  };
})
.controller('VideoCtrl', function($scope, $log, $ionicPopup, $ionicModal, State, RtcommService){
  
  $scope.myEndpointUUID = null;
  $scope.myUser = State.userid;
  $scope.sessionStarted = false;
  $scope.sessionState = null;
  $scope.users = State.users;

  $log.debug('-------- Inited Video Controller ----------');

  // Update and check this;
  $scope.$on('$ionicView.enter', function() {
    $scope.users = State.users;
    $log.debug('VideoCtrl Enter -- Users?', $scope.users);
  });

  $ionicModal.fromTemplateUrl('/templates/presence-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });


  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  $scope.connect = function connect(callee) {
     $log.debug('Pressed connect -- got user: '+callee);
      if (callee) {
        $scope.myEndpointUUID = RtcommService.placeCall(callee, ['webrtc']);
      } else {
        $log.error('You must enter a callee');
      }
      $scope.closeModal();
  };

  $scope.sessionAction = function() {
    // Issue a 'connect' or disconnect.
    if ($scope.sessionStarted) {
      RtcommService.endCall(RtcommService.getEndpoint(RtcommService.getActiveEndpoint()));
    } else {
     $scope.openModal();
     /*
     $ionicPopup.prompt({
       title: 'Call someone',
       template: 'Who would you like to call?',
       inputType: 'person',
       inputPlaceholder: 'callee'
     }).then(function(callee) {
      if (callee) {
        $scope.myEndpointUUID = RtcommService.placeCall(callee, ['webrtc']);
      } else {
        $log.error('You must enter a callee');
      }
     });
    */
    }
  };
  $scope.$on('session:started', function(event, object) {
    $log.debug('VideoCtrl - session:started');
    $scope.sessionStarted = true;
  });
  $scope.$on('session:stopped', function(event, object) {
    $log.debug('VideoCtrl - session:stopped');
    $scope.sessionStarted = false;
  });
  $scope.$on('session:failed', function(event, object) {
    $log.debug('VideoCtrl - session:failed');
    $scope.sessionStarted = false;
  });
})
.controller('UsersCtrl', function($scope, $log, State) {
  $scope.users = State.users;
  $log.debug('UsersCtrl!', $scope.users);
  $scope.$on('$ionicView.enter', function() {
    $log.debug('Users Enter -- loading config ', $scope.users);
  });
})
// Settings controller
.controller('SettingsCtrl', function($scope, $log, Settings) {
  $scope.settings = {};
  $scope.$on('$ionicView.enter', function() {
    $log.debug('Settings Enter -- loading config ');
    $scope.settings = Settings.load();
  });
  $scope.$on('$ionicView.leave', function() {
    // Save the settings
    Settings.save();
  });
  




});
