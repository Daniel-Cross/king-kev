import { Difficulty } from "../constants/enums";
import { Footballer } from "../constants/footballers";

/**
 * Gets footballers filtered by difficulty
 * @param footballers - Array of footballers to filter
 * @param difficulty - Difficulty level to filter by
 */
export const getFootballersByDifficulty = (
  footballers: Footballer[],
  difficulty: Difficulty
): Footballer[] => {
  return footballers.filter(
    (footballer) => footballer.difficulty === difficulty
  );
};

/**
 * Gets a random footballer from a filtered list
 */
export const getRandomFootballer = (
  footballers: Footballer[],
  difficulty: Difficulty
): Footballer => {
  const filtered = getFootballersByDifficulty(footballers, difficulty);
  if (filtered.length === 0) {
    throw new Error(`No footballers found for difficulty: ${difficulty}`);
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
};

/**
 * Shuffles an array
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Validates that all players have at least 3 clubs
 */
export const validateFootballers = (footballers: Footballer[]): boolean => {
  const invalidPlayers = footballers.filter(
    (player) => player.clubs.length < 3
  );
  if (invalidPlayers.length > 0) {
    console.error(
      "Invalid players found (less than 3 clubs):",
      invalidPlayers.map((p) => p.name)
    );
    return false;
  }
  return true;
};
