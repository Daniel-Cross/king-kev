import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

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
    updateFavourites: (state, action: PayloadAction<any>) => {
      const checkForDuplicates = state.favourites.some(
        (quote) => quote === action.payload
      );

      if (checkForDuplicates) {
        const removeDuplicates = state.favourites.filter(
          (quote) => quote !== action.payload
        );
        state.favourites = removeDuplicates;

        return state;
      }

      if (!checkForDuplicates) {
        state.favourites.push(action.payload);
        return state;
      }
    },
    clearFavourites: (state) => {
      state = initialState;
    },
  },
});

export const { updateFavourites, clearFavourites } = favourites.actions;

export default favourites.reducer;
