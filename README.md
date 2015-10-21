#Overview

This mobile sample application uses the http://github.com/WASdev/lib.rtcomm.clientjs and http://github.com/WASdev/lib.angular-rtcomm to make WebRTC Audio/Video calls on a mobile device.  It is heavily reliant on the http://phonertc.io project.

#Getting Started
To use this sample application, you need to do the following steps:

1. Install NodeJS from here https://nodejs.org/. Please verify the installation path is added to Path environment variable

2. Know your MQTT server address host:port (used in step 7.1) - you will need this server to communicate between users. 

3. Install ionic & cordova & bower:

```
$  npm install -g cordova ionic bower
```
NOTE: use `$ sudo npm install -g cordova ionic bower` if you are running on a Mac.

4. Clone and configure the sample application code:
 
  1)  Clone the Project (sample.rtcomm.mobile)
  ```
  git clone https://github.com/WASdev/sample.rtcomm.mobile.git 
  ```
  2) Go into the project directory   (e.g. cd sample.rtcomm.mobile)
  ```
  cd sample.rtcomm.mobile
  ```
  3) Install Dependencies
  ```
  npm install
  grunt install
  ```
  4) Add platforms iOS / android / browser
  ```
  $  ionic platform add ios browser android
  ```
  5) Run as usual:
  ```
  $ ionic run android --device
  $ ionic run ios --device
  ```



   6) Configure and run the sample application:
      1. Go to Settings tab and fill there "MQTT server" host and "MQTT server" port (ensure that server is up and running).
      2. Topic should be the same for all users who wants to share AV.
      3. In "My UserID" put the user name you want to register with.
      4. Go to the Video tab and press "Please Register" button.
      5. When you want to make a call, hit the "Make a Call" button and fill the peer user name.
      

#References
**IONIC**
Start here: http://ionicframework.com/getting-started/

**cordova.plugin.iosrtc**
https://github.com/eface2face/cordova-plugin-iosrtc

