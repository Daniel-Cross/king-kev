/**
 * Migration script to upload existing constants to Firebase
 * Run this once to seed Firebase with existing data
 * 
 * Usage: Import and call migrateDataToFirebase() from your app initialization or a separate script
 */

import firestore from "@react-native-firebase/firestore";
import { FOOTBALLERS, CLUBS } from "@keggy-data/data";

const FOOTBALLERS_COLLECTION = "footballers";
const CLUBS_COLLECTION = "clubs";

/**
 * Migrates all footballers from constants to Firebase
 */
export const migrateFootballers = async (): Promise<void> => {
  try {
    console.log("Starting footballer migration...");
    
    const batch = firestore().batch();
    let count = 0;

    for (const footballer of FOOTBALLERS) {
      // Convert clubs array to just store club names and countries
      const clubsData = footballer.clubs.map((club) => ({
        name: club.name,
        country: club.country,
      }));

      const docRef = firestore()
        .collection(FOOTBALLERS_COLLECTION)
        .doc(footballer.id.toString());

      batch.set(
        docRef,
        {
          name: footballer.name,
          clubs: clubsData,
          difficulty: footballer.difficulty,
          position: footballer.position,
          nationality: footballer.nationality,
          image: footballer.image || null,
          status: "approved", // Mark existing data as approved
          migratedAt: firestore.Timestamp.fromDate(new Date()),
        },
        { merge: true }
      );

      count++;

      // Firestore batches are limited to 500 operations
      if (count % 500 === 0) {
        await batch.commit();
        console.log(`Migrated ${count} footballers...`);
      }
    }

    // Commit remaining operations
    if (count % 500 !== 0) {
      await batch.commit();
    }

    console.log(`✅ Successfully migrated ${count} footballers to Firebase`);
  } catch (error) {
    console.error("Error migrating footballers:", error);
    throw error;
  }
};

/**
 * Migrates all clubs from constants to Firebase
 */
export const migrateClubs = async (): Promise<void> => {
  try {
    console.log("Starting club migration...");

    // Get unique clubs (avoid duplicates)
    const uniqueClubs = new Map<string, typeof CLUBS[0]>();
    for (const club of CLUBS) {
      const key = `${club.name}_${club.country}`;
      if (!uniqueClubs.has(key)) {
        uniqueClubs.set(key, club);
      }
    }

    const batch = firestore().batch();
    let count = 0;

    for (const club of uniqueClubs.values()) {
      // Use club name + country as document ID to avoid duplicates
      const docId = `${club.name}_${club.country}`.replace(/[^a-zA-Z0-9_]/g, "_");
      
      const docRef = firestore()
        .collection(CLUBS_COLLECTION)
        .doc(docId);

      batch.set(
        docRef,
        {
          name: club.name,
          country: club.country,
          status: "approved", // Mark existing data as approved
          migratedAt: firestore.Timestamp.fromDate(new Date()),
        },
        { merge: true }
      );

      count++;

      // Firestore batches are limited to 500 operations
      if (count % 500 === 0) {
        await batch.commit();
        console.log(`Migrated ${count} clubs...`);
      }
    }

    // Commit remaining operations
    if (count % 500 !== 0) {
      await batch.commit();
    }

    console.log(`✅ Successfully migrated ${count} clubs to Firebase`);
  } catch (error) {
    console.error("Error migrating clubs:", error);
    throw error;
  }
};

/**
 * Runs both migrations
 */
export const migrateDataToFirebase = async (): Promise<void> => {
  try {
    console.log("🚀 Starting data migration to Firebase...");
    
    await migrateClubs();
    await migrateFootballers();
    
    console.log("✅ All data migration completed!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};

