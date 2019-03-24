Install react-native https://facebook.github.io/react-native/docs/getting-started.html

$ npm install

$ react-native link

$ react-native run-ios / react-native run-android

https://gitlab.com/kitchry/react-native/wikis/API-for-mobile-app

1. react-native/Libraries/Renderer/src/renderers/native/ReactNativePropRegistry
in
native-base and react-native-easy-grid : dist/src/utils/

2. buildToolsVersion to 25.0.0 in build.gradle
in
react-native-hockeyapp, react-native-vector-icons and react-native-fabric : 


!!! Release / development versions !!!

RELEASE:

    - iOS:
        bundle ID = com.kitchry.kitchryApp
        display name = Kitchry
    - Android:
        bundle ID = com.kitchryapp
        display name = Kitchry

DEV:

    - iOS:
        bundle ID = com.kitchry.kitchryApp-develop   '-'
        display name = Kitchry_dev
    - Android:
        bundle ID = com.kitchryapp_develop    '_'
        display name = Kitchry_dev
    


NOTE:

   - Because on react-native version that we use (0.45.1) it put the restriction on an iOS project. You need to use Xcode with the version that is not higher than 9.2.
   - iOS only! If you install dependencies first time, while running iOS app right after this, you will get an error that you need to fix manually. In Xcode you will see files that have method: `override open static func ...` . Everything that you need to do it is remove `override` word from each file that have this method and relaunch project. 
   