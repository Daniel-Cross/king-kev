import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Footballer, Difficulty } from "@keggy-data/data";
import { GameId } from "../constants/enums";

export interface GameState {
  currentGame: GameId | null;
  difficulty: Difficulty | null;
  currentIndex: number;
  answers: string[][];
  gameEnded: boolean;
  timeLeft: number;
  score: number;
  questions: Footballer[];
  totalQuestions: number;
}

const initialState: GameState = {
  currentGame: null,
  difficulty: null,
  currentIndex: 0,
  answers: [],
  gameEnded: false,
  timeLeft: 60,
  score: 0,
  questions: [],
  totalQuestions: 10,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startGame: (
      state,
      action: PayloadAction<{
        game: GameId;
        difficulty: Difficulty;
        questions: Footballer[];
      }>
    ) => {
      state.currentGame = action.payload.game;
      state.difficulty = action.payload.difficulty;
      state.questions = action.payload.questions;
      state.currentIndex = 0;
      state.answers = [];
      state.gameEnded = false;
      state.timeLeft = 60;
      state.score = 0;
      state.totalQuestions = action.payload.questions.length;
    },
    setAnswer: (state, action: PayloadAction<string[]>) => {
      state.answers[state.currentIndex] = action.payload;
    },
    nextQuestion: (state) => {
      state.currentIndex += 1;
      state.timeLeft = 60;
    },
    updateScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },
    setTimeLeft: (state, action: PayloadAction<number>) => {
      state.timeLeft = action.payload;
    },
    endGame: (state) => {
      state.gameEnded = true;
    },
    resetGame: (state) => {
      state.currentIndex = 0;
      state.answers = [];
      state.gameEnded = false;
      state.timeLeft = 60;
      state.score = 0;
    },
    quitGame: (state) => {
      state.currentGame = null;
      state.difficulty = null;
      state.currentIndex = 0;
      state.answers = [];
      state.gameEnded = false;
      state.timeLeft = 60;
      state.score = 0;
      state.questions = [];
    },
  },
});

export const {
  startGame,
  setAnswer,
  nextQuestion,
  updateScore,
  setTimeLeft,
  endGame,
  resetGame,
  quitGame,
} = gameSlice.actions;

export default gameSlice.reducer;
