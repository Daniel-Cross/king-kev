import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Country, Difficulty, Club, CLUBS } from "@keggy-data/data";
import { submitFootballer } from "../helpers/submissionService";
import { normalizeName } from "../helpers/nameHelpers";
import { useAppSelector } from "../store/hooks";
import CountryPicker from "../components/molecules/CountryPicker";
import ClubAutocomplete from "../components/molecules/ClubAutocomplete";
import { GAME_COLORS, PRIMARY } from "../constants/colours";
import { LOGO_FONT, BODY_FONT } from "../constants/typography";
import { Layout } from "../constants/enums";

const AddPlayer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  // Use local club constants instead of Firebase (which doesn't have club data yet)
  // Combine with any Firebase clubs if they exist in the future
  const { clubs: firebaseClubs } = useAppSelector((state) => state.data);
  const clubs = [...CLUBS, ...firebaseClubs];
  const [footballerName, setFootballerName] = useState("");
  const [nationality, setNationality] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [clubNames, setClubNames] = useState<string[]>([""]);
  const [clubCountries, setClubCountries] = useState<Country[]>([
    Country.ENGLAND,
  ]);
  const [submitting, setSubmitting] = useState(false);

  const difficultyOptions = Object.values(Difficulty);

  const difficultyColors: Record<Difficulty, string> = {
    [Difficulty.EASY]: GAME_COLORS.easy,
    [Difficulty.MEDIUM]: GAME_COLORS.medium,
    [Difficulty.HARD]: GAME_COLORS.hard,
    [Difficulty.VERY_HARD]: GAME_COLORS.very_hard,
  };

  const addClub = () => {
    setClubNames([...clubNames, ""]);
    setClubCountries([...clubCountries, Country.ENGLAND]);
  };

  const removeClub = (index: number) => {
    if (clubNames.length > 1) {
      setClubNames(clubNames.filter((_, i) => i !== index));
      setClubCountries(clubCountries.filter((_, i) => i !== index));
    }
  };

  const updateClubName = (index: number, value: string) => {
    const updated = [...clubNames];
    updated[index] = value;
    setClubNames(updated);
  };

  const handleClubSelect = (index: number, club: Club) => {
    updateClubName(index, club.name);
  };

  const updateClubCountry = (index: number, value: Country) => {
    const updated = [...clubCountries];
    updated[index] = value;
    setClubCountries(updated);
  };

  const handleSubmitFootballer = async () => {
    if (!footballerName.trim()) {
      Alert.alert("Error", "Please enter a footballer name");
      return;
    }

    if (!nationality.trim()) {
      Alert.alert("Error", "Please enter a nationality");
      return;
    }

    if (clubNames.some((name) => !name.trim())) {
      Alert.alert("Error", "Please fill in all club names");
      return;
    }

    setSubmitting(true);
    try {
      await submitFootballer({
        name: footballerName,
        clubNames,
        clubCountries,
        difficulty,
        nationality,
      });

      Alert.alert(
        "Success! 🎉",
        "Footballer submitted successfully! It will be reviewed before being added to the game.",
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setFootballerName("");
              setNationality("");
              setDifficulty(Difficulty.EASY);
              setClubNames([""]);
              setClubCountries([Country.ENGLAND]);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to submit footballer"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={[GAME_COLORS.gradient_start, GAME_COLORS.gradient_end]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={PRIMARY.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add a Player</Text>
            <View style={styles.backButtonPlaceholder} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.subtitle}>
              Help expand the game by adding footballers and their clubs!
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Player Details</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Footballer Name *</Text>
                <TextInput
                  style={styles.input}
                  value={footballerName}
                  onChangeText={setFootballerName}
                  placeholder="e.g., Lionel Messi"
                  placeholderTextColor={PRIMARY.input_icon}
                />
                {footballerName && (
                  <Text style={styles.preview}>
                    Will be saved as: {normalizeName(footballerName)}
                  </Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Nationality *</Text>
                <TextInput
                  style={styles.input}
                  value={nationality}
                  onChangeText={setNationality}
                  placeholder="e.g., Argentina"
                  placeholderTextColor={PRIMARY.input_icon}
                />
                {nationality && (
                  <Text style={styles.preview}>
                    Will be saved as: {normalizeName(nationality)}
                  </Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Difficulty *</Text>
                <View style={styles.radioGroup}>
                  {difficultyOptions.map((diff) => (
                    <TouchableOpacity
                      key={diff}
                      style={[
                        styles.radioButton,
                        difficulty === diff && {
                          backgroundColor: difficultyColors[diff],
                          borderColor: difficultyColors[diff],
                        },
                      ]}
                      onPress={() => setDifficulty(diff)}
                    >
                      <Text
                        style={[
                          styles.radioText,
                          difficulty === diff && styles.radioTextSelected,
                        ]}
                      >
                        {diff.charAt(0).toUpperCase() +
                          diff.slice(1).replace("-", " ")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Clubs Played For *</Text>
                {clubNames.map((clubName, index) => (
                  <View key={index} style={styles.clubRow}>
                    <View style={styles.clubInputContainer}>
                      <ClubAutocomplete
                        value={clubName}
                        country={clubCountries[index]}
                        clubs={clubs}
                        onChangeText={(value) => updateClubName(index, value)}
                        onSelectClub={(club) => handleClubSelect(index, club)}
                        placeholder="Club name"
                        style={[styles.clubInput, { marginRight: 8 }]}
                      />
                      <CountryPicker
                        value={clubCountries[index]}
                        onValueChange={(country) => {
                          updateClubCountry(index, country);
                          // Clear club name when country changes
                          updateClubName(index, "");
                        }}
                        style={[styles.countryPicker, { marginRight: 8 }]}
                      />
                    </View>
                    {clubNames.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeClub(index)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color={PRIMARY.red}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity style={styles.addButton} onPress={addClub}>
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color={PRIMARY.white}
                  />
                  <Text style={styles.addButtonText}>Add Another Club</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  submitting && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitFootballer}
                disabled={submitting}
              >
                <Text style={styles.submitButtonText}>
                  {submitting ? "Submitting..." : "Submit Player"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                All submissions are reviewed before being added to the game.
                Thank you for contributing! 🙏
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: Layout.CENTER,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: Layout.CENTER,
    alignItems: Layout.CENTER,
  },
  backButtonPlaceholder: {
    width: 40,
  },
  headerTitle: {
    ...LOGO_FONT,
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  subtitle: {
    ...BODY_FONT,
    fontSize: 16,
    textAlign: Layout.CENTER,
    marginBottom: 24,
    opacity: 0.9,
  },
  formSection: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    ...LOGO_FONT,
    fontSize: 22,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    ...BODY_FONT,
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: PRIMARY.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: PRIMARY.black_main,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  preview: {
    ...BODY_FONT,
    fontSize: 12,
    marginTop: 6,
    opacity: 0.8,
    fontStyle: "italic",
  },
  countryPicker: {
    minWidth: 150,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  radioButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: PRIMARY.white,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 12,
    marginBottom: 12,
  },
  radioText: {
    ...BODY_FONT,
    fontSize: 14,
  },
  radioTextSelected: {
    fontWeight: "600",
  },
  clubRow: {
    flexDirection: "row",
    alignItems: Layout.CENTER,
    marginBottom: 12,
  },
  clubInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  clubInput: {
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: Layout.CENTER,
    justifyContent: Layout.CENTER,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: PRIMARY.white,
    borderStyle: "dashed",
    marginTop: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  addButtonText: {
    ...BODY_FONT,
    fontSize: 14,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: PRIMARY.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: Layout.CENTER,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...LOGO_FONT,
    fontSize: 18,
    color: GAME_COLORS.gradient_start,
  },
  footer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
  },
  footerText: {
    ...BODY_FONT,
    fontSize: 14,
    textAlign: Layout.CENTER,
    lineHeight: 20,
    opacity: 0.9,
  },
});

export default AddPlayer;
