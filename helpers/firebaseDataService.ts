import firestore from "@react-native-firebase/firestore";
import {
  Club,
  Country,
  Footballer,
  FOOTBALLERS,
  CLUBS,
} from "@keggy-data/data";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CLUBS_COLLECTION = "clubs";
const CACHE_KEY_CLUBS = "@clubs_cache";
const CACHE_TIMESTAMP_KEY_CLUBS = "@clubs_cache_timestamp";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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
 * Fetches footballers from the package data
 */
export const fetchFootballers = async (): Promise<Footballer[]> => {
  return FOOTBALLERS;
};

/**
 * Fetches all approved clubs from Firebase
 * Falls back to package data if Firebase is empty or unavailable
 */
export const fetchClubs = async (): Promise<Club[]> => {
  try {
    // Check cache first
    const cached = await getCachedClubs();
    if (cached && cached.length > 0) {
      // Return cached data and fetch fresh data in background
      fetchClubsFromFirebase().catch((error: any) => {
        // Only log non-permission errors
        if (error?.code !== "firestore/permission-denied") {
          console.error("Background fetch error:", error);
        }
      });
      return cached;
    }

    // Fetch from Firebase
    const firebaseClubs = await fetchClubsFromFirebase();

    // If Firebase returns empty, fallback to package data
    if (firebaseClubs.length === 0) {
      console.log("Firebase returned no clubs, using package data");
      return CLUBS;
    }

    return firebaseClubs;
  } catch (error: any) {
    // Only log non-permission errors (permission errors are expected if Firestore rules require auth)
    if (error?.code !== "firestore/permission-denied") {
      console.error("Error fetching clubs:", error);
    }
    // Fallback to cache if available
    const cached = await getCachedClubs();
    if (cached && cached.length > 0) {
      return cached;
    }
    // Final fallback to package data
    console.log("Using package data as fallback");
    return CLUBS;
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
    await AsyncStorage.removeItem(CACHE_KEY_CLUBS);
    await AsyncStorage.removeItem(CACHE_TIMESTAMP_KEY_CLUBS);
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
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
      (error: any) => {
        // Only log non-permission errors (permission errors are expected if Firestore rules require auth)
        if (error?.code !== "firestore/permission-denied") {
          console.error("Error in clubs subscription:", error);
        }
      }
    );

  return unsubscribe;
};
