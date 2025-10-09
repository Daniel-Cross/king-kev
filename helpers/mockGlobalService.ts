import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock global service that simulates global heart counts
// This can be replaced with real Firebase or other global service later

const GLOBAL_HEART_COUNTS_KEY = "mockGlobalHeartCounts";

// Simulate global heart counts by using a shared storage key
export const trackHeartPressGlobal = async (
  quoteId: number,
  isAdding: boolean
) => {
  try {
    // Get current global heart counts
    const globalData = await AsyncStorage.getItem(GLOBAL_HEART_COUNTS_KEY);
    const globalHeartCounts = globalData ? JSON.parse(globalData) : {};

    // Update heart count
    const currentCount = globalHeartCounts[quoteId] || 0;
    globalHeartCounts[quoteId] = currentCount + (isAdding ? 1 : -1);

    // Save updated counts
    await AsyncStorage.setItem(
      GLOBAL_HEART_COUNTS_KEY,
      JSON.stringify(globalHeartCounts)
    );

    console.log(
      `Global heart ${
        isAdding ? "added" : "removed"
      } for quote ${quoteId}. New count: ${globalHeartCounts[quoteId]}`
    );

    return globalHeartCounts[quoteId];
  } catch (error) {
    console.error("Error tracking global heart press:", error);
    return 0;
  }
};

export const getGlobalHeartCount = async (quoteId: number): Promise<number> => {
  try {
    const globalData = await AsyncStorage.getItem(GLOBAL_HEART_COUNTS_KEY);
    const globalHeartCounts = globalData ? JSON.parse(globalData) : {};
    return globalHeartCounts[quoteId] || 0;
  } catch (error) {
    console.error("Error getting global heart count:", error);
    return 0;
  }
};

export const getAllGlobalHeartCounts = async (): Promise<{
  [key: number]: number;
}> => {
  try {
    const globalData = await AsyncStorage.getItem(GLOBAL_HEART_COUNTS_KEY);
    return globalData ? JSON.parse(globalData) : {};
  } catch (error) {
    console.error("Error getting all global heart counts:", error);
    return {};
  }
};

// Simulate real-time updates by periodically checking for changes
export const subscribeToGlobalHeartCounts = (
  onUpdate: (heartCounts: { [key: number]: number }) => void
) => {
  let isSubscribed = true;

  const checkForUpdates = async () => {
    if (!isSubscribed) return;

    try {
      const counts = await getAllGlobalHeartCounts();
      onUpdate(counts);
    } catch (error) {
      console.error("Error checking for updates:", error);
    }

    // Check for updates every 2 seconds
    setTimeout(checkForUpdates, 2000);
  };

  // Start checking for updates
  checkForUpdates();

  // Return unsubscribe function
  return () => {
    isSubscribed = false;
  };
};
