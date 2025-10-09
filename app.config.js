const pkgs = require("./package.json");
const BUILD_NUMBER = Math.floor(Date.now() / 1000).toString();

export default {
  expo: {
    name: "Keggy",
    slug: "keggy",
    version: pkgs.version,
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    jsEngine: "hermes",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.daniel.cross.keggy",
      buildNumber: BUILD_NUMBER,
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      versionCode: parseInt(BUILD_NUMBER, 10),
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.daniel.cross.keggy",
      googleServicesFile: "./google-services.json",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "1fbc6c8b-b067-4cf0-a423-079c6ae65d5e",
        runtimeVersion: {
          policy: "appVersion",
        },
        ios: {
          buildNumber: BUILD_NUMBER,
        },
        android: {
          versionCode: parseInt(BUILD_NUMBER, 10),
        },
      },
      // Firebase configuration
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId:
        process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    },
    plugins: [
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            buildReactNativeFromSource: true,
          },
        },
      ],
      "@react-native-firebase/app",
    ],
  },
};
