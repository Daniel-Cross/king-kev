import { Dimensions, Platform } from "react-native";

export const IS_IOS = () => (Platform.OS === "ios" ? true : false);
export const width = Dimensions.get("window").width;

export const ROUTE = {
  HOME: "HOME",
  GAME: "GAME",
};
