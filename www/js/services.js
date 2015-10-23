angular.module('rtcommMobile.services', ['angular-rtcomm-service'])
.factory('Global', function($rootScope, $log, rtcommService, Settings) {
    // State object to be returned.
    var state = {
      registered :false,
      insession : false,
      users: [], 
      message : "Not registered",
      alert: '',
      userid: ''
    };
    var presenceMonitor = null;
    $rootScope.$on('rtcomm::init', function(event, registered, object ) {
      presenceMonitor = rtcommService.getPresenceMonitor(Settings.load().presenceTopic);
      angular.copy(presenceMonitor.getPresenceData()[0].flatten(), state.users);
      presenceMonitor.on('updated', function(presenceData) {
        $rootScope.$evalAsync(function() {
          angular.copy(presenceMonitor.getPresenceData()[0].flatten(), state.users);
          $log.debug('--------- Presence Updated ---------- users:', state.users);
        });
      });
      $rootScope.$evalAsync(function(){
        if (registered) {
          state.registered = true;
          state.userid = object.userid;
          state.message = "Registered as "+object.userid;
        } else {
          state.registered= false;
          state.message = "Init Failed:" + object;
        }
      });
    });
	  $rootScope.$on('rtcomm::alert', function(event, eventObject){
       $log.debug('received alert event: ', eventObject);
       if (eventObject.msg === 'document_replaced') {
         state.message = 'Not registered';
       }
       state.alert = eventObject.msg ? eventObject.msg : eventObject;
    });
    $rootScope.$on('reset', function(event, eventObject) {
      $log.debug('RESET: ', eventObject);
      state.message = 'Connection was reset' ;
      state.registered = false;
      state.insession = false;
    });
    $rootScope.$on('session:started', function(event, eventObject) {
      state.insession = true;
    });
    $rootScope.$on('session:stopped', function(event, eventObject) {
      state.insession = false;
    });
    $rootScope.$on('session:failed', function(event, eventObject) {
      $log.debug('FAILED', eventObject);
      state.message = 'Session Start failed';
      state.insession = false;
    });
   return { state: state} ;
})
.factory('Settings', function($rootScope, $http, $log, rtcommService){

  var configURL = "/rtcommConfig.json";
  var defaultConfig = { 
    enableVideo: true,
    register: false,
    server: 'messagesight.demos.ibm.com',
    port: 1883,
    presenceTopic: 'mobileClients',
    rtcommDebug: 'DEBUG',
    userid : '',
	  rtcommTopicPath : "/rtcommMobile-1234/"
  };
  var localConfig = localStorage['rtcommConfig'] ? 
                    JSON.parse(localStorage['rtcommConfig']) :  
                    null;
  var mySettings = defaultConfig;

  $log.info('Using LocalStorage config: ', localConfig);

  $rootScope.$evalAsync(function(){
    if(localConfig) {
      angular.extend(mySettings, localConfig);
    } else {
      $log.info('Loading config in Config Service...');
      $http.get(configURL)
        .success( function(cfg){
          $log.info('Received cfg: ',cfg);
          defaultConfig = cfg; 
          angular.extend(mySettings, defaultConfig);
          $log.info('Config is now: ',mySettings );
          localStorage['rtcommConfig'] = JSON.stringify(mySettings);
        })
        .error(function(data,status,headers){
          angular.extend(mySettings, defaultConfig);
          $log.debug("Config Service unable to access config "+status);
        });
    }
    $log.debug('Settings:  ',mySettings);
  });

  return {
    load: function() {
      return mySettings
    },
    save: function(){
      localStorage['rtcommConfig'] = JSON.stringify(mySettings);
    }
  };
});
