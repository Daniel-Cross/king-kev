const pkgs = require("./package.json");
const BUILD_NUMBER = Math.floor(Date.now() / 1000).toString();

export default {
  expo: {
    name: "keggy",
    slug: "keggy",
    version: pkgs.version,
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.daniel.cross.keggy",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.daniel.cross.keggy",
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
    ],
  },
};
