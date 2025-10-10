import { Difficulty } from "../constants/enums";
import { Footballer, FOOTBALLERS } from "../constants/footballers";

// Helper functions
export const getFootballersByDifficulty = (
  difficulty: Difficulty
): Footballer[] => {
  return FOOTBALLERS.filter(
    (footballer) => footballer.difficulty === difficulty
  );
};

export const getRandomFootballer = (difficulty: Difficulty): Footballer => {
  const footballers = getFootballersByDifficulty(difficulty);
  const randomIndex = Math.floor(Math.random() * footballers.length);
  return footballers[randomIndex];
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Validation function to ensure all players have at least 3 clubs
export const validateFootballers = (): boolean => {
  const invalidPlayers = FOOTBALLERS.filter(
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
