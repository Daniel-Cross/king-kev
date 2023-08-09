import { StatusBar } from "expo-status-bar";
import Routes from "./navigation/Routes";
import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "./hooks/fonts";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await useFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        onLayoutRootView();
      }
    }
    prepare();
  }, []);

  if (!isReady) {
    return null;
  }
  return (
    <>
      <StatusBar style="auto" animated={true} />
      <Routes />
    </>
  );
}
