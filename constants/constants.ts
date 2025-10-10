import { Dimensions, Platform } from "react-native";

export const IS_IOS = () => (Platform.OS === "ios" ? true : false);
export const width = Dimensions.get("window").width;

export const ROUTE = {
  HOME: "HOME",
  FAVOURITES: "FAVOURITES",
  GAME: "GAME",
  GAME_SELECTION: "GameSelection",
  WHO_INTRODUCTION: "WhoIntroduction",
  WHO: "Who",
  GUESS_CLUBS_SELECTION: "GuessClubsSelection",
  GUESS_CLUBS: "GuessClubs",
  SCORE: "Score",
};
