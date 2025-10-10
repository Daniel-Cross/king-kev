export const PRIMARY = {
  blue_main: "#0073B6",
  blue_dark: "#094C7C",
  blue_smooth: "#73C8EB",
  blue_light: "#B5DEF3",
  blue_extra_light: "#D5EBF7",
  blue_ultra_light: "#E8F3F9",
  blue_ultra_light_2: "#F0FAFF",
  black_main: "#29292D",
  black_dark: "#121214",
  white: "#FFFFFF",
  green: "#53d769",
  red: "#fc3d39",
  input_icon: "rgba(60, 60, 67, 0.6)",
  yellow: "#fecb2e",
  orange: "#fd9426",
  pink: "#fc3158",
  background_white: "#ededed",
};

// Game-specific colors
export const GAME_COLORS = {
  // Difficulty colors
  easy: "#4CAF50",
  medium: "#FF9800",
  hard: "#F44336",
  very_hard: "#9C27B0",

  // Game theme colors
  who_said_it: "#4CAF50",
  guess_clubs: "#2196F3",

  // Gradient colors
  gradient_start: "#FB5FA1",
  gradient_end: "#F4AA60",
  guess_clubs_gradient_start: "#2196F3",
  guess_clubs_gradient_end: "#21CBF3",

  // UI colors
  success: "#4CAF50",
  danger: "#F44336",
  warning: "#FF9800",
  info: "#2196F3",
  primary_button: "#007BFF",
  tab_active: "#5F7AE0",

  // Text colors
  text_white: "#fff",
  text_black: "#000",
};

// App-wide colors
export const COLORS = {
  ...PRIMARY,
  ...GAME_COLORS,
};
