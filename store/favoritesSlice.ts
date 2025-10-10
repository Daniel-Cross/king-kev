import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesState {
  userHearts: { [key: number]: boolean };
  globalHeartCounts: { [key: number]: number };
  isLoading: boolean;
}

const initialState: FavoritesState = {
  userHearts: {},
  globalHeartCounts: {},
  isLoading: true,
};

const FAVORITES_STORAGE_KEY = "userFavorites";

// Load favorites from AsyncStorage
export const loadFavoritesFromStorage = async (): Promise<{
  [key: number]: boolean;
}> => {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error loading favorites from storage:", error);
    return {};
  }
};

// Save favorites to AsyncStorage
export const saveFavoritesToStorage = async (favorites: {
  [key: number]: boolean;
}): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favorites)
    );
  } catch (error) {
    console.error("Error saving favorites to storage:", error);
  }
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorites: (
      state,
      action: PayloadAction<{ [key: number]: boolean }>
    ) => {
      state.userHearts = action.payload;
      state.isLoading = false;
    },
    setGlobalHeartCounts: (
      state,
      action: PayloadAction<{ [key: number]: number }>
    ) => {
      state.globalHeartCounts = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const quoteId = action.payload;
      state.userHearts[quoteId] = !state.userHearts[quoteId];

      // Save to AsyncStorage
      saveFavoritesToStorage(state.userHearts);
    },
    setFavorite: (
      state,
      action: PayloadAction<{ quoteId: number; isFavorite: boolean }>
    ) => {
      const { quoteId, isFavorite } = action.payload;
      state.userHearts[quoteId] = isFavorite;

      // Save to AsyncStorage
      saveFavoritesToStorage(state.userHearts);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setFavorites,
  setGlobalHeartCounts,
  toggleFavorite,
  setFavorite,
  setLoading,
} = favoritesSlice.actions;
export default favoritesSlice.reducer;
