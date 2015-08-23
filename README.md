These are notes on how this project was setup.

To use this project, you need to:

1. Know your MQTT server address host:port. 



2. Install Ionic & Cordova:

  1) $  sudo npm install -g cordova ionic bower

  2) Clone this project

      git clone git@github.rtp.raleigh.ibm.com:swgraham-us/rtcommmobile.git

  3) Go into the project directory

      cd rtcommmobile 

  4) Add platforms iOS / android / browzer

      $  ionic platform add ios browser android

  5) In order to install PhoneRTC on iOS, please follow these steps:

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

  6) Build the project.

      6.1) Prior to actually building the project in Xcode, you have to build it in Cordova:
      From the Project directory (rtcommMobile) run:
      cordova prepare
  
      NOTE: If this throws some errors on copying some png, files, just ignore.
      ALSO -- Anytime you change anything in the js/html files, you need to run cordova prepare to get the pushed to the           correct platform runtime (and then build it if you want in xCode)

      6.2) Build the project in Xcode
      If there are serveral compilation errors ,resolove them as proposed by XCode.

  7) Testing in your browser
    From your project directory (rtcommMobile), run:
    cordova serve

    This will serve the app in a nodeinstance and you can access it locally in a browser. This is a good technique for UI        work as its quicker to see if your changes worked.

    However, this DOES NOT actually use the PhoneRTC Plugin, but a 'shim' into the Browser's WebRTC Functionality. You still     need to test on the actual device you want to run on.

References
IONIC
Starting here: http://ionicframework.com/getting-started/

phonertc.io
https://github.com/alongubkin/phonertc/wiki/Installation
