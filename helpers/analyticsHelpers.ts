import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

// Analytics tracking for heart counts
export const trackHeartPress = async (quoteId: number, isAdding: boolean) => {
  try {
    // Update global heart count in Firestore
    const quoteRef = firestore()
      .collection("quoteHearts")
      .doc(quoteId.toString());

    if (isAdding) {
      await quoteRef.update({
        count: firestore.FieldValue.increment(1),
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await quoteRef.update({
        count: firestore.FieldValue.increment(-1),
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      });
    }

    // Store user's heart history locally
    const userHeartsKey = "userHeartHistory";
    const userHeartsData = await AsyncStorage.getItem(userHeartsKey);
    const userHearts = userHeartsData ? JSON.parse(userHeartsData) : {};
    userHearts[quoteId] = isAdding;
    await AsyncStorage.setItem(userHeartsKey, JSON.stringify(userHearts));

    // Get the updated count
    const doc = await quoteRef.get();
    const newCount = doc.exists ? doc.data()?.count || 0 : 0;

    console.log(
      `Heart ${
        isAdding ? "added" : "removed"
      } for quote ${quoteId}. New count: ${newCount}`
    );

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
    const userHeartsKey = "userHeartHistory";

    const heartCountsData = await AsyncStorage.getItem(heartCountsKey);
    const heartCounts = heartCountsData ? JSON.parse(heartCountsData) : {};

    const userHeartsData = await AsyncStorage.getItem(userHeartsKey);
    const userHearts = userHeartsData ? JSON.parse(userHeartsData) : {};

    const currentCount = heartCounts[quoteId] || 0;
    heartCounts[quoteId] = currentCount + (isAdding ? 1 : -1);
    userHearts[quoteId] = isAdding;

    await AsyncStorage.setItem(heartCountsKey, JSON.stringify(heartCounts));
    await AsyncStorage.setItem(userHeartsKey, JSON.stringify(userHearts));

    return heartCounts[quoteId];
  } catch (error) {
    console.error("Error with local tracking:", error);
    return 0;
  }
};

// Get heart count for a specific quote
export const getHeartCount = async (quoteId: number): Promise<number> => {
  try {
    const doc = await firestore()
      .collection("quoteHearts")
      .doc(quoteId.toString())
      .get();

    if (doc.exists) {
      return doc.data()?.count || 0;
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
    const snapshot = await firestore().collection("quoteHearts").get();
    const heartCounts: { [key: number]: number } = {};

    snapshot.forEach((doc) => {
      const quoteId = parseInt(doc.id);
      heartCounts[quoteId] = doc.data()?.count || 0;
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
    return firestore()
      .collection("quoteHearts")
      .onSnapshot(
        (snapshot) => {
          const heartCounts: { [key: number]: number } = {};
          snapshot.forEach((doc) => {
            const quoteId = parseInt(doc.id);
            heartCounts[quoteId] = doc.data()?.count || 0;
          });
          onUpdate(heartCounts);
        },
        (error) => {
          console.error("Error listening to heart counts:", error);
        }
      );
  } catch (error) {
    console.error("Error setting up heart count listener:", error);
    return null;
  }
};

// Initialize heart count documents in Firestore (run once)
export const initializeHeartCounts = async () => {
  try {
    const batch = firestore().batch();
    const { KEGGY, OWEN } = await import("../constants/quotes");

    // Initialize all quotes with 0 heart count
    [...KEGGY, ...OWEN].forEach((quote) => {
      const quoteRef = firestore()
        .collection("quoteHearts")
        .doc(quote.id.toString());

      batch.set(
        quoteRef,
        {
          count: 0,
          lastUpdated: firestore.FieldValue.serverTimestamp(),
          quoteId: quote.id,
          type: quote.type,
        },
        { merge: true }
      );
    });

    await batch.commit();
    console.log("Heart counts initialized in Firestore");
  } catch (error) {
    console.error("Error initializing heart counts:", error);
  }
};
