import { CLUBS } from "../constants/clubs";
import { Country } from "../constants/enums";

// Helper function to map nationality to country
export const getCountryFromNationality = (
  nationality: string
): Country | null => {
  const nationalityMap: { [key: string]: Country } = {
    Argentina: Country.ARGENTINA,
    Portugal: Country.PORTUGAL,
    England: Country.ENGLAND,
    France: Country.FRANCE,
    Sweden: Country.SWEDEN,
    Wales: Country.ENGLAND, // No Wales clubs, use England
    Croatia: Country.CROATIA,
    Belgium: Country.BELGIUM,
    Brazil: Country.BRAZIL,
    Italy: Country.ITALY,
    Japan: Country.JAPAN,
    Nigeria: Country.ENGLAND, // No Nigeria clubs, use England
    Romania: Country.ROMANIA,
    Bulgaria: Country.BULGARIA,
  };
  return nationalityMap[nationality] || null;
};

// Function to generate club options (correct + wrong answers)
export const generateClubOptions = (currentFootballer: any): string[] => {
  if (!currentFootballer || !currentFootballer.clubs) {
    return [];
  }
  const correctClubs = currentFootballer.clubs.map((club: any) => club.name);
  const correctClubNames = new Set(correctClubs);

  // Get countries from the player's actual clubs
  const playerCountries = new Set(
    currentFootballer.clubs.map((club: any) => club.country)
  );

  // Get player's nationality country
  const nationalityCountry = getCountryFromNationality(
    currentFootballer.nationality
  );

  // Collect wrong answer clubs
  const wrongClubs: string[] = [];

  // Add clubs from the same countries as player's clubs (excluding correct clubs)
  playerCountries.forEach((country) => {
    const countryClubs = CLUBS.filter(
      (club) => club.country === country && !correctClubNames.has(club.name)
    ).map((club) => club.name);
    wrongClubs.push(...countryClubs);
  });

  // Add one club from player's nationality (if different from existing countries)
  if (nationalityCountry && !playerCountries.has(nationalityCountry)) {
    const nationalityClubs = CLUBS.filter(
      (club) =>
        club.country === nationalityCountry && !correctClubNames.has(club.name)
    ).map((club) => club.name);
    if (nationalityClubs.length > 0) {
      wrongClubs.push(nationalityClubs[0]); // Add just one club from nationality
    }
  }

  // Shuffle and limit wrong clubs to provide more options
  const shuffledWrongClubs = wrongClubs.sort(() => Math.random() - 0.5);
  const limitedWrongClubs = shuffledWrongClubs.slice(
    0,
    Math.max(8, correctClubs.length * 4)
  );

  // Combine correct and wrong clubs, then shuffle
  const allClubs = [...correctClubs, ...limitedWrongClubs];
  return allClubs.sort(() => Math.random() - 0.5);
};

// Helper function to check if two arrays are equal
export const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
};

// Helper function to format time
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
