import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FavouriteProps {
  favourites: number[];
}

const initialState: FavouriteProps = {
  favourites: [],
};

export const favourites = createSlice({
  name: "favouritesData",
  initialState,
  reducers: {
    setFavourites: (state, action: PayloadAction<number[]>) => {
      state.favourites = action.payload;
    },
    updateFavourites: (state, action: PayloadAction<number>) => {
      const quoteId = action.payload;
      if (state.favourites.includes(quoteId)) {
        state.favourites = state.favourites.filter((id) => id !== quoteId);
      } else {
        state.favourites.push(quoteId);
      }
      AsyncStorage.setItem("favourites", JSON.stringify(state.favourites)); // Save to AsyncStorage
    },
    clearFavourites: (state) => {
      state = initialState;
      AsyncStorage.removeItem("favourites");
      return state;
    },
  },
});

export const { setFavourites, updateFavourites, clearFavourites } =
  favourites.actions;

export const loadFavourites: any = () => async (dispatch: any) => {
  try {
    const favourites = await AsyncStorage.getItem("favourites");
    dispatch(setFavourites(favourites ? JSON.parse(favourites) : []));
  } catch (error) {
    console.error("Failed to load favourites from AsyncStorage:", error);
  }
};

export default favourites.reducer;
