import { Platform } from "react-native";

export const IS_IOS = () => (Platform.OS === "ios" ? true : false);

export const ROUTE = {
  HOME: "HOME",
  GAME: "GAME",
};
