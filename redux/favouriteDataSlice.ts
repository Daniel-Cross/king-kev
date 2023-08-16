import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavouriteProps {
  favourites: string[];
}

const initialState: FavouriteProps = {
  favourites: [],
};

export const favourites = createSlice({
  name: "favouritesData",
  initialState,
  reducers: {
    setFavourites: (state, action: PayloadAction<string[]>) => {
      state.favourites = action.payload;
    },
    updateFavourites: (state, action: PayloadAction<any>) => {
      const checkForDuplicates = state.favourites.some(
        (quote) => quote === action.payload
      );

      if (checkForDuplicates) {
        const removeDuplicates = state.favourites.filter(
          (quote) => quote !== action.payload
        );
        state.favourites = removeDuplicates;
        AsyncStorage.setItem("favourites", JSON.stringify(state.favourites)); // Save to AsyncStorage
        return state;
      }

      if (!checkForDuplicates) {
        state.favourites.push(action.payload);
        AsyncStorage.setItem("favourites", JSON.stringify(state.favourites)); // Save to AsyncStorage
        return state;
      }
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
