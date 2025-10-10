import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "@react-native-firebase/firestore";

// Analytics tracking for heart counts
export const trackHeartPress = async (quoteId: number, isAdding: boolean) => {
  const startTime = Date.now();
  try {
    // Update global heart count in Firestore
    const db = getFirestore();
    const quoteRef = doc(db, "quoteHearts", quoteId.toString());

    // First, get the current document to see if it exists
    const currentDoc = await getDoc(quoteRef);
    const currentCount = currentDoc.exists()
      ? currentDoc.data()?.count || 0
      : 0;

    const newCount = isAdding
      ? currentCount + 1
      : Math.max(0, currentCount - 1);

    // Use setDoc with merge to create or update the document
    await Promise.race([
      setDoc(
        quoteRef,
        {
          count: newCount,
          lastUpdated: serverTimestamp(),
          quoteId: quoteId,
        },
        { merge: true }
      ),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore write timeout")), 5000)
      ),
    ]);

    const endTime = Date.now();

    return newCount;
  } catch (error) {
    console.error("Error tracking heart press:", error);
    // Fallback to local storage if Firebase fails
    return await trackHeartPressLocal(quoteId, isAdding);
  }
};

// Fallback local tracking function
const trackHeartPressLocal = async (quoteId: number, isAdding: boolean) => {
  try {
    const heartCountsKey = "globalHeartCounts";
    const heartCountsData = await AsyncStorage.getItem(heartCountsKey);
    const heartCounts = heartCountsData ? JSON.parse(heartCountsData) : {};

    const currentCount = heartCounts[quoteId] || 0;
    heartCounts[quoteId] = Math.max(0, currentCount + (isAdding ? 1 : -1));

    await AsyncStorage.setItem(heartCountsKey, JSON.stringify(heartCounts));

    return heartCounts[quoteId];
  } catch (error) {
    console.error("Error with local tracking:", error);
    return 0;
  }
};

// Get heart count for a specific quote
export const getHeartCount = async (quoteId: number): Promise<number> => {
  try {
    const db = getFirestore();
    const docRef = doc(db, "quoteHearts", quoteId.toString());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data()?.count || 0;
    }
    return 0;
  } catch (error) {
    console.error("Error getting heart count:", error);
    // Fallback to local storage
    try {
      const heartCountsData = await AsyncStorage.getItem("globalHeartCounts");
      const heartCounts = heartCountsData ? JSON.parse(heartCountsData) : {};
      return heartCounts[quoteId] || 0;
    } catch (localError) {
      console.error("Error with local fallback:", localError);
      return 0;
    }
  }
};

// Get all heart counts
export const getAllHeartCounts = async (): Promise<{
  [key: number]: number;
}> => {
  try {
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, "quoteHearts"));

    const heartCounts: { [key: number]: number } = {};

    snapshot.forEach((docSnap) => {
      const quoteId = parseInt(docSnap.id);
      const count = docSnap.data()?.count || 0;
      heartCounts[quoteId] = count;
    });

    return heartCounts;
  } catch (error) {
    console.error("Error getting all heart counts:", error);
    // Fallback to local storage
    try {
      const heartCountsData = await AsyncStorage.getItem("globalHeartCounts");
      return heartCountsData ? JSON.parse(heartCountsData) : {};
    } catch (localError) {
      console.error("Error with local fallback:", localError);
      return {};
    }
  }
};

// Check if user has hearted a quote
export const hasUserHearted = async (quoteId: number): Promise<boolean> => {
  try {
    const userHeartsData = await AsyncStorage.getItem("userHeartHistory");
    const userHearts = userHeartsData ? JSON.parse(userHeartsData) : {};
    return userHearts[quoteId] || false;
  } catch (error) {
    console.error("Error checking user heart status:", error);
    return false;
  }
};

// Get user's hearted quotes
export const getUserHeartedQuotes = async (): Promise<number[]> => {
  try {
    const userHeartsData = await AsyncStorage.getItem("userHeartHistory");
    const userHearts = userHeartsData ? JSON.parse(userHeartsData) : {};
    return Object.keys(userHearts)
      .filter((key) => userHearts[key])
      .map((key) => parseInt(key));
  } catch (error) {
    console.error("Error getting user hearted quotes:", error);
    return [];
  }
};

// Set up real-time listener for heart counts
export const subscribeToHeartCounts = (
  onUpdate: (heartCounts: { [key: number]: number }) => void
) => {
  try {
    const db = getFirestore();
    return onSnapshot(
      collection(db, "quoteHearts"),
      (snapshot) => {
        const heartCounts: { [key: number]: number } = {};
        snapshot.forEach((docSnap) => {
          const quoteId = parseInt(docSnap.id);
          const count = docSnap.data()?.count || 0;
          heartCounts[quoteId] = count;
        });
        onUpdate(heartCounts);
      },
      (error) => {
        console.error("❌ Error listening to heart counts:", error);
      }
    );
  } catch (error) {
    console.error("❌ Error setting up heart count listener:", error);
    return null;
  }
};

// Initialize Firebase and set up real-time listeners
export const initializeFirebaseApp = async (
  dispatch: any,
  setGlobalHeartCounts: any
) => {
  try {
    // Load initial heart counts from Firebase
    const counts = await getAllHeartCounts();
    dispatch(setGlobalHeartCounts(counts));

    // Set up real-time listener for global heart counts
    const unsubscribe = subscribeToHeartCounts((counts) => {
      dispatch(setGlobalHeartCounts(counts));
    });

    return unsubscribe;
  } catch (error) {
    console.error("❌ Firebase app initialization failed:", error);
    return null;
  }
};

// Load user hearts from Redux/AsyncStorage
export const loadUserHeartsFromStorage = async (
  dispatch: any,
  setFavorites: any
) => {
  try {
    const { loadFavoritesFromStorage } = await import(
      "../store/favoritesSlice"
    );
    const favorites = await loadFavoritesFromStorage();
    dispatch(setFavorites(favorites));
  } catch (error) {
    console.error("Error loading user hearts from Redux:", error);
  }
};
