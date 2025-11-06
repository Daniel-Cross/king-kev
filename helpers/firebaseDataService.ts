import firestore from "@react-native-firebase/firestore";
import { Club, Country } from "../constants/enums";
import { Footballer } from "../constants/footballers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FOOTBALLERS_COLLECTION = "footballers";
const CLUBS_COLLECTION = "clubs";
const CACHE_KEY_FOOTBALLERS = "@footballers_cache";
const CACHE_KEY_CLUBS = "@clubs_cache";
const CACHE_TIMESTAMP_KEY_FOOTBALLERS = "@footballers_cache_timestamp";
const CACHE_TIMESTAMP_KEY_CLUBS = "@clubs_cache_timestamp";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Converts Firestore document to Footballer
 */
const documentToFootballer = (doc: any): Footballer => {
  const data = doc.data();
  // Clubs are stored as array of {name, country} objects in Firebase
  const clubs = (data.clubs || []).map((club: any) => ({
    name: club.name,
    country: club.country as Country,
  }));
  
  return {
    id: parseInt(doc.id) || doc.id,
    name: data.name,
    clubs: clubs,
    difficulty: data.difficulty,
    position: data.position,
    nationality: data.nationality,
    image: data.image,
  };
};

/**
 * Converts Firestore document to Club
 */
const documentToClub = (doc: any): Club => {
  const data = doc.data();
  return {
    name: data.name,
    country: data.country as Country,
  };
};

/**
 * Fetches all approved footballers from Firebase
 */
export const fetchFootballers = async (): Promise<Footballer[]> => {
  try {
    // Check cache first
    const cached = await getCachedFootballers();
    if (cached) {
      // Return cached data and fetch fresh data in background
      fetchFootballersFromFirebase().catch((error) =>
        console.error("Background fetch error:", error)
      );
      return cached;
    }

    // Fetch from Firebase
    return await fetchFootballersFromFirebase();
  } catch (error) {
    console.error("Error fetching footballers:", error);
    // Fallback to cache if available
    const cached = await getCachedFootballers();
    if (cached) {
      return cached;
    }
    throw error;
  }
};

/**
 * Fetches footballers directly from Firebase
 */
const fetchFootballersFromFirebase = async (): Promise<Footballer[]> => {
  const snapshot = await firestore()
    .collection(FOOTBALLERS_COLLECTION)
    .where("status", "==", "approved")
    .get();

  const footballers = snapshot.docs.map(documentToFootballer);

  // Cache the results
  await cacheFootballers(footballers);

  return footballers;
};

/**
 * Fetches all approved clubs from Firebase
 */
export const fetchClubs = async (): Promise<Club[]> => {
  try {
    // Check cache first
    const cached = await getCachedClubs();
    if (cached) {
      // Return cached data and fetch fresh data in background
      fetchClubsFromFirebase().catch((error) =>
        console.error("Background fetch error:", error)
      );
      return cached;
    }

    // Fetch from Firebase
    return await fetchClubsFromFirebase();
  } catch (error) {
    console.error("Error fetching clubs:", error);
    // Fallback to cache if available
    const cached = await getCachedClubs();
    if (cached) {
      return cached;
    }
    throw error;
  }
};

/**
 * Fetches clubs directly from Firebase
 */
const fetchClubsFromFirebase = async (): Promise<Club[]> => {
  const snapshot = await firestore()
    .collection(CLUBS_COLLECTION)
    .where("status", "==", "approved")
    .get();

  const clubs = snapshot.docs.map(documentToClub);

  // Cache the results
  await cacheClubs(clubs);

  return clubs;
};

/**
 * Caches footballers to AsyncStorage
 */
const cacheFootballers = async (footballers: Footballer[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      CACHE_KEY_FOOTBALLERS,
      JSON.stringify(footballers)
    );
    await AsyncStorage.setItem(
      CACHE_TIMESTAMP_KEY_FOOTBALLERS,
      Date.now().toString()
    );
  } catch (error) {
    console.error("Error caching footballers:", error);
  }
};

/**
 * Gets cached footballers if still valid
 */
const getCachedFootballers = async (): Promise<Footballer[] | null> => {
  try {
    const timestampStr = await AsyncStorage.getItem(
      CACHE_TIMESTAMP_KEY_FOOTBALLERS
    );
    if (!timestampStr) return null;

    const timestamp = parseInt(timestampStr);
    const now = Date.now();
    if (now - timestamp > CACHE_DURATION) {
      return null; // Cache expired
    }

    const cached = await AsyncStorage.getItem(CACHE_KEY_FOOTBALLERS);
    if (!cached) return null;

    return JSON.parse(cached) as Footballer[];
  } catch (error) {
    console.error("Error reading cached footballers:", error);
    return null;
  }
};

/**
 * Caches clubs to AsyncStorage
 */
const cacheClubs = async (clubs: Club[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CACHE_KEY_CLUBS, JSON.stringify(clubs));
    await AsyncStorage.setItem(
      CACHE_TIMESTAMP_KEY_CLUBS,
      Date.now().toString()
    );
  } catch (error) {
    console.error("Error caching clubs:", error);
  }
};

/**
 * Gets cached clubs if still valid
 */
const getCachedClubs = async (): Promise<Club[] | null> => {
  try {
    const timestampStr = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY_CLUBS);
    if (!timestampStr) return null;

    const timestamp = parseInt(timestampStr);
    const now = Date.now();
    if (now - timestamp > CACHE_DURATION) {
      return null; // Cache expired
    }

    const cached = await AsyncStorage.getItem(CACHE_KEY_CLUBS);
    if (!cached) return null;

    return JSON.parse(cached) as Club[];
  } catch (error) {
    console.error("Error reading cached clubs:", error);
    return null;
  }
};

/**
 * Clears all cached data (useful for testing or manual refresh)
 */
export const clearCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CACHE_KEY_FOOTBALLERS);
    await AsyncStorage.removeItem(CACHE_KEY_CLUBS);
    await AsyncStorage.removeItem(CACHE_TIMESTAMP_KEY_FOOTBALLERS);
    await AsyncStorage.removeItem(CACHE_TIMESTAMP_KEY_CLUBS);
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};

/**
 * Sets up real-time listeners for footballers (optional, for live updates)
 */
export const subscribeToFootballers = (
  callback: (footballers: Footballer[]) => void
): (() => void) => {
  const unsubscribe = firestore()
    .collection(FOOTBALLERS_COLLECTION)
    .where("status", "==", "approved")
    .onSnapshot(
      (snapshot) => {
        const footballers = snapshot.docs.map(documentToFootballer);
        cacheFootballers(footballers);
        callback(footballers);
      },
      (error) => {
        console.error("Error in footballers subscription:", error);
      }
    );

  return unsubscribe;
};

/**
 * Sets up real-time listeners for clubs (optional, for live updates)
 */
export const subscribeToClubs = (
  callback: (clubs: Club[]) => void
): (() => void) => {
  const unsubscribe = firestore()
    .collection(CLUBS_COLLECTION)
    .where("status", "==", "approved")
    .onSnapshot(
      (snapshot) => {
        const clubs = snapshot.docs.map(documentToClub);
        cacheClubs(clubs);
        callback(clubs);
      },
      (error) => {
        console.error("Error in clubs subscription:", error);
      }
    );

  return unsubscribe;
};

