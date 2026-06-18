# AgroAI Android App Wrapper

This is a lightweight Android app that opens your AgroAI web application inside a `WebView`.

## Setup

1. Install Android Studio or Gradle.
2. Open this folder as an Android project or use Gradle from the command line.

## Web app URL

The app currently loads:

`http://192.168.1.10:5173/`

If you are using an Android emulator, change `WEB_APP_URL` in `app/src/main/java/com/agroai/app/MainActivity.kt` to:

`http://10.0.2.2:5173/`

If using a physical device on the same Wi-Fi network, keep the local IP and ensure your frontend dev server is running with `npm run dev -- --host 0.0.0.0`.

## Build

From the `android` folder:

```bash
./gradlew assembleDebug
```

Or open the project in Android Studio and run it on an emulator/device.
