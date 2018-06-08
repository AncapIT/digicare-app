CareLink Frontend
=================
  
General install  
---------------
1. Prerequisites are Xcode, Andorid SDK (incl in Android Studio), and Java Development Kit JDK8/1.8 (JDK9 currently not recognized). More info:  
`https://cordova.apache.org/docs/en/latest/guide/platforms/android/`  
1. Set environment variables, Update .profile in home directory  
`nano .profile`  
`export ANDROID_HOME=$HOME/Library/Android/sdk`  
`export JAVA_HOME=$(/usr/libexec/java_home)`  
1. Install node.js https://nodejs.org  
1. Install Ionic and Cordova https://ionicframework.com/getting-started, may need to install as root using sudo  
`npm install -g cordova ionic`  
1. Clone project  
1. cd into project directory to start working on it  
1. Add support for iOS and Android to project  
`ionic cordova platform add ios`  
`ionic cordova platform add android`  
  
iOS and Android 
---------------
1. From project root, build iOS and/or Android project, will be created in platforms/ios and/or platforms/android. Leave out --prod and --release flags for faster (but less optimized) build.  
`ionic cordova build ios --prod --release`  
`ionic cordova build android --prod --release`  
1. iOS: Open project in Xcode and create .ipa file from Product\Archive  
`platforms/ios/DigiCare.xcodeproj`  
Android: Open project in Android Studio and sign .apk from Build\Generate Signed APK  
`platforms/android/` 

Web
---
1. After build for iOS and/or Android, copy www directory to web server  
  
Change Prod/Test server in app
------------------------------
From login give username/password server/prod or server/test to switch between production and test server.  
  
Other
-----
- To change icon for app, change `resources/icon.png` (only PNG-8) and then `ionic cordova resources`  
- If problems with ionic building after changing certificates, signing etc try removing ionic platform, it will install again with next build command.  
`ionic cordova platform remove ios`  