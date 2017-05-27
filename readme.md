# Running

One terminal for build and watch for changes<br>
,


    sudo npm run build -- --watch

One terminal to run the development server<br>

    npm start

Open another terminal to run it on a iOS/android emulator<br>

    npm run ios 
        -- or 
    npm run android 

Works only on linux

    sudo npm run build -- --watch &! npm start &! npm run emulator &! npm run android
        -- or
    npm run all

Build release

    cd android && ./gradlew assembleRelease