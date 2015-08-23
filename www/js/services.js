angular.module('rtcommMobile.services', ['angular-rtcomm'])
.factory('Video', function($rootScope, $log, RtcommService) {
})

.factory('Config', function($rootScope, $http, $log, RtcommService){
  var configURL = "rtcommConfig.json";
  var defaultConfig = {};
  var localConfig = localStorage['rtcommConfig'] ? 
                    JSON.parse(localStorage['rtcommConfig']) :  
                    null;

  $log.info('Using LocalStorage config: ', localConfig);
  var config = localConfig || { enableVideo: true,
    server: 'anatf-tp.haifa.ibm.com',
    port: 9080,
	  rtcommTopicPath : "/rtcomm/",
    queue: 'Doctors',
  };

  $rootScope.$evalAsync(function(){
    if(localConfig) {
      angular.extend(config, localConfig);
    } else {
      $log.info('Loading config in Config Service...');
      $http.get(configURL)
        .success( function(cfg){
          $log.info('Received cfg: ',cfg);
          defaultConfig = cfg; 
          angular.extend(config, defaultConfig);
          $log.info('Config is now: ',config);
          localStorage['rtcommConfig'] = JSON.stringify(config);
        })
        .error(function(data,status,headers,config){
          $log.debug("Config Service unable to access config "+status);
        });
    }
  });

  return {
    config: config,
    set: function(){
      localStorage['rtcommConfig'] = JSON.stringify(config);
      RtcommService.setConfig(config);
    },
    getKey: function(key){
      return config[key];
    }
  };
});
