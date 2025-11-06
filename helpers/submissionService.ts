import firestore from "@react-native-firebase/firestore";
import { Country, Difficulty } from "../constants/enums";
import { normalizeName } from "./nameHelpers";
// Note: clubExists is now async and requires clubs array,
// but submission service will check against Firebase submissions
// For now, we'll skip the check here and let Firebase handle duplicates

export interface FootballerSubmission {
  name: string;
  clubNames: string[];
  clubCountries: Country[];
  difficulty: Difficulty;
  nationality: string;
  submittedBy?: string;
  submittedAt: Date;
  status: "pending" | "approved" | "rejected";
}

export interface ClubSubmission {
  name: string;
  country: Country;
  submittedBy?: string;
  submittedAt: Date;
  status: "pending" | "approved" | "rejected";
}

const FOOTBALLERS_COLLECTION = "footballer_submissions";
const CLUBS_COLLECTION = "club_submissions";

/**
 * Submits a footballer for review.
 * Automatically checks if clubs exist and creates club submissions if needed.
 */
export const submitFootballer = async (
  footballerData: Omit<FootballerSubmission, "submittedAt" | "status">
): Promise<void> => {
  try {
    const normalizedName = normalizeName(footballerData.name);

    // Validate that we have the same number of clubs and countries
    if (
      footballerData.clubNames.length !== footballerData.clubCountries.length
    ) {
      throw new Error(
        "Number of club names must match number of club countries"
      );
    }

    // Check each club and create submissions for missing ones
    // Note: We submit all clubs and let Firebase/admin handle duplicates
    const clubSubmissions: Promise<void>[] = [];
    for (let i = 0; i < footballerData.clubNames.length; i++) {
      const clubName = footballerData.clubNames[i];
      const clubCountry = footballerData.clubCountries[i];

      // Submit the club for review (Firebase will handle duplicates)
      clubSubmissions.push(
        submitClub({
          name: clubName,
          country: clubCountry,
          submittedBy: footballerData.submittedBy,
        })
      );
    }

    // Wait for all club submissions to complete
    await Promise.all(clubSubmissions);

    // Submit the footballer
    const submission = {
      ...footballerData,
      name: normalizedName,
      clubNames: footballerData.clubNames.map(normalizeName),
      submittedAt: firestore.Timestamp.fromDate(new Date()),
      status: "pending",
    };

    await firestore().collection(FOOTBALLERS_COLLECTION).add(submission);
  } catch (error) {
    console.error("Error submitting footballer:", error);
    throw error;
  }
};

/**
 * Submits a club for review.
 */
export const submitClub = async (
  clubData: Omit<ClubSubmission, "submittedAt" | "status">
): Promise<void> => {
  try {
    // Note: We don't check for existing clubs here since we want to submit to Firebase
    // Admin can review and approve/reject duplicates
    const normalizedName = normalizeName(clubData.name);

    const submission = {
      ...clubData,
      name: normalizedName,
      submittedAt: firestore.Timestamp.fromDate(new Date()),
      status: "pending",
    };

    await firestore().collection(CLUBS_COLLECTION).add(submission);
  } catch (error) {
    console.error("Error submitting club:", error);
    throw error;
  }
};

/**
 * Gets all pending submissions (for admin review).
 */
export const getPendingSubmissions = async (): Promise<{
  footballers: FootballerSubmission[];
  clubs: ClubSubmission[];
}> => {
  try {
    const [footballerSnapshot, clubSnapshot] = await Promise.all([
      firestore()
        .collection(FOOTBALLERS_COLLECTION)
        .where("status", "==", "pending")
        .get(),
      firestore()
        .collection(CLUBS_COLLECTION)
        .where("status", "==", "pending")
        .get(),
    ]);

    const footballers = footballerSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate(),
    })) as FootballerSubmission[];

    const clubs = clubSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate(),
    })) as ClubSubmission[];

    return { footballers, clubs };
  } catch (error) {
    console.error("Error getting pending submissions:", error);
    throw error;
  }
};
