import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Footballer, Club } from "@keggy-data/data";
import {
  fetchFootballers,
  fetchClubs,
} from "../helpers/firebaseDataService";

interface DataState {
  footballers: Footballer[];
  clubs: Club[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: DataState = {
  footballers: [],
  clubs: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks for fetching data
export const loadFootballData = createAsyncThunk(
  "data/loadFootballData",
  async (_, { rejectWithValue }) => {
    try {
      const [footballers, clubs] = await Promise.all([
        fetchFootballers(),
        fetchClubs(),
      ]);
      return { footballers, clubs };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to load data"
      );
    }
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setFootballers: (state, action: PayloadAction<Footballer[]>) => {
      state.footballers = action.payload;
      state.lastUpdated = Date.now();
    },
    setClubs: (state, action: PayloadAction<Club[]>) => {
      state.clubs = action.payload;
      state.lastUpdated = Date.now();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFootballData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadFootballData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.footballers = action.payload.footballers;
        state.clubs = action.payload.clubs;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(loadFootballData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFootballers, setClubs, clearError } = dataSlice.actions;
export default dataSlice.reducer;

