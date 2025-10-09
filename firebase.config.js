// Firebase configuration using environment variables
import { initializeApp } from "@react-native-firebase/app";
import { firebaseConfig, validateFirebaseConfig } from "./config/firebase";

// Validate Firebase configuration
try {
  validateFirebaseConfig();
} catch (error) {
  console.error("Firebase configuration error:", error);
  throw error;
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
