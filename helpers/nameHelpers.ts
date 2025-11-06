/**
 * Normalizes a string to have the first letter of each word capitalized.
 * Handles special cases like "&", "-", and apostrophes.
 *
 * Examples:
 * - "manchester united" -> "Manchester United"
 * - "paris saint-germain" -> "Paris Saint-Germain"
 * - "brighton & hove albion" -> "Brighton & Hove Albion"
 * - "o'connor" -> "O'Connor"
 */
export const normalizeName = (name: string): string => {
  if (!name || name.trim().length === 0) {
    return "";
  }

  return name
    .trim()
    .split(/\s+/)
    .map((word) => {
      // Handle special characters that should be preserved
      if (word.length === 0) return word;

      // Handle words with apostrophes (e.g., "O'Connor", "D'Angelo")
      if (word.includes("'")) {
        return word
          .split("'")
          .map((part, index) => {
            if (index === 0) {
              return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            }
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
          })
          .join("'");
      }

      // Handle words with hyphens (e.g., "Saint-Germain", "West Ham")
      if (word.includes("-")) {
        return word
          .split("-")
          .map(
            (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          )
          .join("-");
      }

      // Handle special characters like "&" - keep them as is but capitalize surrounding words
      if (word === "&" || word === "and") {
        return word.toLowerCase();
      }

      // Standard capitalization
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ")
    .replace(/\s+/g, " "); // Normalize multiple spaces to single space
};

/**
 * Validates that a name follows proper capitalization rules.
 */
export const validateNameFormat = (name: string): boolean => {
  const normalized = normalizeName(name);
  return normalized === name;
};
