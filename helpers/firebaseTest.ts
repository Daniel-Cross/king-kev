import firestore from "@react-native-firebase/firestore";

// Test Firebase connection and functionality
export const testFirebaseConnection = async () => {
  try {
    console.log("Testing Firebase connection...");

    // Test basic Firestore connection
    const testDoc = await firestore()
      .collection("test")
      .doc("connection")
      .get();

    console.log("✅ Firebase connection successful");
    return true;
  } catch (error) {
    console.error("❌ Firebase connection failed:", error);
    return false;
  }
};

// Test heart count functionality
export const testHeartCountFunctionality = async () => {
  try {
    console.log("Testing heart count functionality...");

    // Test reading from quoteHearts collection
    const snapshot = await firestore().collection("quoteHearts").limit(1).get();

    console.log("✅ Heart count functionality working");
    console.log(`Found ${snapshot.size} heart count documents`);
    return true;
  } catch (error) {
    console.error("❌ Heart count functionality failed:", error);
    return false;
  }
};

// Run all Firebase tests
export const runFirebaseTests = async () => {
  console.log("🔥 Running Firebase tests...");

  const connectionTest = await testFirebaseConnection();
  const heartCountTest = await testHeartCountFunctionality();

  if (connectionTest && heartCountTest) {
    console.log("🎉 All Firebase tests passed!");
    return true;
  } else {
    console.log("⚠️ Some Firebase tests failed");
    return false;
  }
};
