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
    // NUNITO_ITALIC: require("../../assets/fonts/Nunito-Italic.ttf"),
    // NUNITO_SEMI_BOLD: require("../../assets/fonts/Nunito-SemiBold.ttf"),
    // NUNITO_BOLD: require("../../assets/fonts/Nunito-Bold.ttf"),
  });
