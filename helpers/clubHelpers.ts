import { Country, Club } from "../constants/enums";
import { normalizeName } from "./nameHelpers";

/**
 * Maps Country enum values to their corresponding file names.
 */
export const getCountryFileName = (country: Country): string => {
  const countryMap: Record<Country, string> = {
    [Country.ENGLAND]: "england",
    [Country.SPAIN]: "spain",
    [Country.GERMANY]: "germany",
    [Country.ITALY]: "italy",
    [Country.FRANCE]: "france",
    [Country.NETHERLANDS]: "netherlands",
    [Country.PORTUGAL]: "portugal",
    [Country.BELGIUM]: "belgium",
    [Country.TURKEY]: "turkey",
    [Country.RUSSIA]: "russia",
    [Country.UKRAINE]: "ukraine",
    [Country.SCOTLAND]: "scotland",
    [Country.GREECE]: "greece",
    [Country.CROATIA]: "croatia",
    [Country.SERBIA]: "serbia",
    [Country.CZECH_REPUBLIC]: "czechRepublic",
    [Country.AUSTRIA]: "austria",
    [Country.SWITZERLAND]: "switzerland",
    [Country.NORWAY]: "norway",
    [Country.SWEDEN]: "sweden",
    [Country.DENMARK]: "denmark",
    [Country.POLAND]: "poland",
    [Country.ROMANIA]: "romania",
    [Country.BULGARIA]: "bulgaria",
    [Country.USA]: "usa",
    [Country.CANADA]: "canada",
    [Country.MEXICO]: "mexico",
    [Country.SAUDI_ARABIA]: "saudiArabia",
    [Country.CHINA]: "china",
    [Country.SOUTH_KOREA]: "southKorea",
    [Country.JAPAN]: "japan",
    [Country.BRAZIL]: "brazil",
    [Country.ARGENTINA]: "argentina",
  };

  return countryMap[country];
};

/**
 * Checks if a club already exists in the provided clubs array.
 * Performs case-insensitive comparison after normalization.
 */
export const clubExists = (
  clubName: string,
  country: Country,
  clubs: Club[]
): boolean => {
  const normalizedName = normalizeName(clubName);
  return clubs.some(
    (club) =>
      normalizeName(club.name) === normalizedName && club.country === country
  );
};

/**
 * Finds a club by name and country in the provided clubs array.
 * Returns the club if found, null otherwise.
 */
export const findClub = (
  clubName: string,
  country: Country,
  clubs: Club[]
): Club | null => {
  const normalizedName = normalizeName(clubName);
  return (
    clubs.find(
      (club) =>
        normalizeName(club.name) === normalizedName && club.country === country
    ) || null
  );
};

/**
 * Creates a new club object with normalized name.
 */
export const createClub = (clubName: string, country: Country): Club => {
  return {
    name: normalizeName(clubName),
    country,
  };
};
