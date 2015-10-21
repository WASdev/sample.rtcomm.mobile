angular.module('rtcommMobile.controllers', [])
/*
 *  The MasterCtrl provides a scope an initialization to access data across tabs. We need it because we have to bring in
 *  a window as active and assign AV window to it.
 */
.controller('MasterCtrl', function MasterCtrl($scope, $ionicTabsDelegate,$log, rtcommService, Global, $ionicPopup, $ionicPlatform, Settings) {
  $log.debug('------- inited MasterCtrl------------ ');
  //TODO:  We should load settings/connect if its done. (move 'register logic here?');
  // Define what we want to use for video tags
  $scope.state = Global.state;
  rtcommService.setViewSelector('local-video','remote-video');
  // Register if we are configured to register.
	$scope.$on('endpointActivated', function (event, endpointUUID) {
		//	Not to do something here to show that this button is live.
    // Select our tab?
    $ionicTabsDelegate.select(1);
		$log.debug('MasterCtrl: endpointActivated =' + endpointUUID);
		rtcommService.setVideoView(endpointUUID);
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
.controller('DashCtrl', function($scope, $log, $ionicLoading, Global, rtcommService, Settings) {
  // handle some events and log information
  $scope.settings = Settings.load();
  // Bind to the state...
  $scope.state = Global.state;
  $scope.action = ($scope.state.registered) ? "Unregister" : "Register";

  $scope.$on('rtcomm::init', function(event,registered,object) {
    $ionicLoading.hide();
  });

  $scope.register = function() {
    // Do some checking here.
    // if not initialized, initialize...
    $log.debug('Register is:'+$scope.state.registered+' Initialized is: '+rtcommService.isInitialized());
    // If we are not registered...
    //
    if (!$scope.state.registered && !rtcommService.isInitialized() && ($scope.settings.userid !== '')) {
      $ionicLoading.show({
        template: 'Loading...'
      });
      $log.debug('Registering as:  '+ $scope.settings.userid);
      // Setting the config will invoke Register if we are not registered.
      rtcommService.setConfig($scope.settings);
      //rtcommService.register($scope.settings.userid);
    } else {
      $log.debug('Calling Unregister... ');
      rtcommService.unregister();
    }
  };
})
.controller('VideoCtrl', function($scope, $log, $ionicPopup, $ionicModal, Global, rtcommService){
  var vm = this;
  vm.myEndpointUUID = null;
  vm.myUser = Global.state.userid;
  vm.sessionStarted = false;
  vm.sessionState = null;
  vm.users = Global.state.users;
  vm.callee = null;
  $log.debug('-------- Inited Video Controller ----------');

  // Update and check this;
  $scope.$on('$ionicView.enter', function() {
    vm.users = Global.state.users;
    vm.myEndpointUUID = rtcommService.getActiveEndpoint();
    $log.debug('VideoCtrl Enter -- Users?', vm.users);
  });

  $ionicModal.fromTemplateUrl('templates/presence-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $log.debug('modal $scope?', $scope);
    $log.debug('modal create vm?', vm);
    $log.debug('modal?', modal);
    vm.modal = modal;
  });

  vm.openModal = function() {
    $log.debug('vm?', vm);
    $log.debug('vm.modal?', vm.modal);
    vm.modal.show();
  };
  vm.closeModal = function() {
    vm.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    vm.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  vm.toggleMute= function toggleMute() {
    // get the endpoint
    $log.debug('toggleMute() called, looking for endpoint '+vm.myEndpointUUID);
    var ep = rtcommService.getEndpoint(vm.myEndpointUUID);
    if (ep.webrtc) {
      if (ep.webrtc.isMuted() ) {
        $log.debug('toggleMute() called: UNMUTING');
        ep.webrtc.unmute();
      } else {
        $log.debug('toggleMute() called: MUTING');
        ep.webrtc.mute();
      }
    }
  };

  vm.connect = function connect(callee) {
     $log.debug('Pressed connect -- got user: '+callee);
     callee = callee ? callee : vm.callee;
      if (callee ) {
        $log.debug('Connecting to user: '+callee);
        vm.myEndpointUUID = rtcommService.placeCall(callee, ['webrtc']);
      } else {
        $log.error('You must enter a callee');
      }
      vm.closeModal();
  };

  vm.sessionAction = function() {
    // Issue a 'connect' or disconnect.
    if (vm.sessionStarted) {
      rtcommService.endCall(rtcommService.getEndpoint(rtcommService.getActiveEndpoint()));
    } else {
     vm.openModal();
     /*
     $ionicPopup.prompt({
       title: 'Call someone',
       template: 'Who would you like to call?',
       inputType: 'person',
       inputPlaceholder: 'callee'
     }).then(function(callee) {
      if (callee) {
        $scope.myEndpointUUID = rtcommService.placeCall(callee, ['webrtc']);
      } else {
        $log.error('You must enter a callee');
      }
     });
    */
    }
  };

  $scope.$on('webrtc:remotemuted', function(event, object) {
    $log.debug('<----- webrtc:remotemuted ---->', object);
    // True means they are muted...
    if (!object.audio && !object.video) {
      $log.debug('<----- webrtc:remotemuted ----> MUTING! ', object);
     //Notify User remote call was muted muting
     $ionicPopup.alert({
       title: 'Call Muted',
       subTitle: 'The remote user muted their call'
     });
    }
  });

  $scope.$on('session:started', function(event, object) {
    $log.debug('VideoCtrl - session:started');
    vm.sessionStarted = true;
  });
  $scope.$on('session:stopped', function(event, object) {
    $log.debug('VideoCtrl - session:stopped');
    vm.sessionStarted = false;
  });
  $scope.$on('session:failed', function(event, object) {
    $log.debug('VideoCtrl - session:failed');
    vm.sessionStarted = false;
  });
})
.controller('UsersCtrl', function($scope, $log, Global,rtcommService) {
  $scope.users = Global.state.users;
  $scope.myUser = Global.state.userid;
  $log.debug('UsersCtrl!',$scope.users);
  $scope.$on('$ionicView.enter', function() {
    $log.debug('Users Enter -- loading config ', $scope.users);
    $log.debug('Global Users Enter -- loading config ', Global.state.users);
  });
  $scope.connect = function connect(callee) {
     $log.debug('Pressed connect -- got user: '+callee);
     callee = callee ? callee : vm.callee;
      if (callee ) {
        $log.debug('Connecting to user: '+callee);
        rtcommService.placeCall(callee, ['webrtc']);
      } else {
        $log.error('You must enter a callee');
      }
  };

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
