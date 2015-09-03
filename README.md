 Mobile sample application using lib.rtcomm.clientjs and lib.angular-rtcomm.

To use this sample application, you need to do the follwoing steps:

1. Install NodeJS from here https://nodejs.org/. Please verify the installation path is added to Path environment variable

2. Know your MQTT server address host:port (used in step 7.1) - you will need this server to communicate between users. Liberty server can be used as MQTT server (Follow the [instructions](http://www-01.ibm.com/support/knowledgecenter/was_beta_liberty/com.ibm.websphere.wlp.nd.multiplatform.doc/ae/twlp_config_rtcomm.html) to configure Liberty as MQTT server - )

3. Install ionic & cordova & bower:

      $  npm install -g cordova ionic bower
      
      
      NOTE: use "$ sudo npm install -g cordova ionic bower" if you are running in Mac.
  
4. Clone and configure this sample application code as follwoing:
 
  1) Clone this project (or you can download it as a zip file)

      git clone git@github.rtp.raleigh.ibm.com:swgraham-us/rtcommmobile.git

  2) Go into the project directory

      cd rtcommmobile 

  3) Add platforms iOS / android / browser

      $  ionic platform add ios browser android

  4) In order to install PhoneRTC on iOS, please follow these steps:

      1. Go platforms/ios and click on [ProjectName].xcodeproj to open it with XCode 
      2. Go to your project settings 
      3. In General, change Deployment Target to 7.0 or above 
      4. Go to Build Settings and change:

          `Valid Architectures` => armv7
          `Build Active Architecture Only` => No
          `Objective-C Bridging Header` =>
              [ProjectName]/Plugins/com.dooble.phonertc/Bridging-Header.h
          `Runpath Search Paths` =>
              $(inherited) @executable_path/Frameworks
      5. Repeat step #4 for the CordovaLib project

  5) Build the project.

      5.1) From the Project directory (rtcommMobile) run:
        cordova prepare
  
      NOTE: If this throws some errors on copying some png, files, just ignore.
      ALSO -- Anytime you change anything in the js/html files, you need to run cordova prepare to get the 
      pushed to the correct platform runtime (and then build it if you want in xCode)

      -- iOS -- Prior to actually building the project in Xcode, you have to build it in Cordova.
      5.2) Build the project in Xcode
      If there are serveral compilation errors ,resolove them as proposed by XCode.

  6) In order to test the application in your browser, go to your project directory (rtcommMobile) and run.

      cordova serve
 
   This will serve the app in a nodeinstance and you can access it locally in a browser. You will need to open browser http://localhost:8000 and then select "browser".
   This is a good technique for UI work as its quicker to see if your changes worked.

   However, this DOES NOT actually use the PhoneRTC Plugin, but a 'shim' into the Browser's 
   WebRTC Functionality. You still need to test on the actual device you want to run on.
   
   7) Configure and run the sample application:
      1. Go to Settings tab and fill there "MQTT server" host and "MQTT server" port (ensure that server is up and running).
      2. Topic should be the same for all users who wants to share AV.
      3. In "My UserID" fille the user name you want to register with.
      4. Go to the Video tab and press "Please Register" button.
      5. When you want to make a call, hit the "Make a Call" button and fill the peer user name.
      

References
IONIC
Starting here: http://ionicframework.com/getting-started/

phonertc.io
https://github.com/alongubkin/phonertc/wiki/Installation
