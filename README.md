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

  5) Install the app to your device:

  ```
  $ ionic run android --device
  $ ionic run ios --device
  ```
  If the above doesn't work you can also use the native SDKs for iOS & Android:

  *iOS*
    1. Open the file: 'sample.rtcomm.mobile/platforms/ios/sample.rtcomm.mobile.xcodeproj' in XCode.
       < You may get prompted to convert the code, go ahead, it shouldn't make any changes>
    2. Go to 'Build Settings', Search for 'Enable Bitcode' and change it to 'No' 
    3. Now you can build & Deploy to your device in the normal fashion (select your device and run the app on it)

    *Note:  The simulators do not seem to work.*

  6) Configure and run the sample application:
    1. Go to Settings tab and make sure "MQTT server" host and "MQTT server" port match the MQTT server your Liberty Server is using. 
    2. Topic should be the same for all users who wants to share AV and match your Liberty Server.
    3. In "My UserID" put the user name you want to register with.
    4. Go to the Status tab and press "Register" button.
    5. When you want to make a call, go to the "Video" Tab and press the Call button.  A list of other users on the system should be displayed.  Select one and a call should start.


#References
**IONIC**
Start here: http://ionicframework.com/getting-started/

**cordova.plugin.iosrtc**
https://github.com/eface2face/cordova-plugin-iosrtc

