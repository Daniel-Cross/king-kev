import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./favoritesSlice";
import gameReducer from "./gameSlice";

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    game: gameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
