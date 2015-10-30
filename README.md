#Overview

This mobile sample application uses the http://github.com/WASdev/lib.rtcomm.clientjs and http://github.com/WASdev/lib.angular-rtcomm to make WebRTC Audio/Video calls on a mobile device.  It is heavily reliant on the iosrtc plugin: https://github.com/eface2face/cordova-plugin-iosrtc

This sample is configured to use a PUBLIC MQTT Server (messagesight.demos.ibm.com). 

#Requirements

1.  A Liberty Profile server that runs with the rtcomm-1.0 feature enabled.
  1. Grab Liberty https://developer.ibm.com/wasdev/downloads/liberty-profile-using-non-eclipse-environments/
  2. And make sure you install rtcomm-1.0:
  ```
  bin/installUtility install rtcomm-1.0
  ```
2.  An MQTT Server such as IBM MessageSite. For prototyping and development, it is possible to use `messagesight.demos.ibm.com`. 

**Note:  For more information on setting up Liberty visit http://angular-rtcomm.wasdev.developer.ibm.com **

#Getting Started
To use this sample application, you need to do the following steps:

1. Install NodeJS from here https://nodejs.org/. Please verify the installation path is added to Path environment variable

2. Know your MQTT server address host:port (used in step 5: 7.1) - you will need this server to communicate between users. 

3.  Configure and start Liberty:
  1.  Create your rtcomm Server:
    ```
    $WLP/bin/server create rtcomm
    ```
  2.  Edit $WLP/usr/servers/rtcomm/server.xml to look like the following server.xml **Change *<SOMEUNIQUESTRING>* to something unique **
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
<server description="rtcomm developer sandbox liberty profile">

    <!-- Enable features -->
    <featureManager>
        <feature>rtcomm-1.0</feature>
        <feature>servlet-3.1</feature>
    </featureManager>

    <httpEndpoint id="defaultHttpEndpoint"
                  httpPort="9080"
                  httpsPort="9443" />

     <!-- Setup the rtcomm options with a unique topic path for the Liberty Server profile -->
	<rtcomm messageServerHost="messagesight.demos.ibm.com" messageServerPort="1883" rtcommTopicPath="/<SOMEUNIQUESTRING>/">
		
		<iceServerURL>stun:stun.l.google.com:19302</iceServerURL>
		<iceServerURL>stun:stun1.l.google.com:19302</iceServerURL>
		<iceServerURL>stun:stun2.l.google.com:19302</iceServerURL>
					
	</rtcomm>
	
</server>
```
   3.  Start the rtcomm server:
      ```
      $WLP/bin/server start rtcomm
   ```
   
4. Install ionic & cordova & bower:
	```
	$  npm install -g cordova ionic bower
	```
	NOTE: use `$ sudo npm install -g cordova ionic bower` if you are running on a Mac.
5. Clone and configure the sample application code:
 
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
  gulp install
  ```
  4) Add platforms iOS / android
  ```
  $  ionic platform add ios android
  ``` 

  5)  Test the app locally
  ```
  $ ionic serve
  ```
  6) Install the app to your device:

  ```
  $ ionic run android --device
  $ ionic run ios --device
  ```
  If the above doesn't work you can also use the native SDKs for iOS & Android:

  **iOS**
    1. Open the file: 'sample.rtcomm.mobile/platforms/ios/sample.rtcomm.mobile.xcodeproj' in XCode.
       < You may get prompted to convert the code, go ahead, it shouldn't make any changes>
    2. Go to 'Build Settings', Search for 'Enable Bitcode' and change it to 'No' 
    3. Now you can build & Deploy to your device in the normal fashion (select your device and run the app on it)

    **Note:  The simulators do not seem to work.**

  7) Configure and run the sample application:

   1. Go to Settings tab and make sure "MQTT server" host and "MQTT server" port match the MQTT server your Liberty Server is using. 
    2. Topic should be the same for all users who wants to share AV and match your Liberty Server.(What you replaced in <SOMEUNIQUESTRING> above.
    3. In "My UserID" put the user name you want to register with.
   4. Go to the Status tab and press "Register" button.
  5. When you want to make a call, go to the "Video" Tab and press the Call button.  A list of other users on the system should be displayed.  Select one and a call should start.

#References
**IONIC**
Start here: http://ionicframework.com/getting-started/

**cordova.plugin.iosrtc**
https://github.com/eface2face/cordova-plugin-iosrtc

