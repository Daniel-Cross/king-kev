// import { useDispatch, useSelector } from "react-redux";
// import type { TypedUseSelectorHook } from "react-redux";
// import type { RootState, AppDispatch } from "./store";
import * as Font from "expo-font";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch: () => AppDispatch = useDispatch;
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useFonts = async () =>
  await Font.loadAsync({
    SHRIKHAND: require("../assets/fonts/Shrikhand-Regular.ttf"),
    PROX_MEDIUM: require("../assets/fonts/proximanova_medium.otf"),
    PROX_BOLD: require("../assets/fonts/proximanova_semibold.otf"),
  });
