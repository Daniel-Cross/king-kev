// Re-export types and enums from enums file
export { Country, Club } from "./enums";

// Import and re-export the merged clubs array from the clubs directory
export { ALL_CLUBS as CLUBS } from "./clubs/index";

// Re-export individual country arrays for specific use cases
export * from "./clubs/index";
