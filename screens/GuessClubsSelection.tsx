import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { BODY_FONT, LOGO_FONT } from "../constants/typography";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout } from "../constants/enums";
import { ROUTE } from "../constants/constants";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { startGame } from "../store/gameSlice";
import {
  getFootballersByDifficulty,
  shuffleArray,
} from "../helpers/footballDataHelpers";
import { GameId, Difficulty } from "../constants/enums";
import { useEffect, useRef } from "react";
import { loadFootballData } from "../store/dataSlice";
import { GAME_COLORS } from "../constants/colours";
import Ionicons from "@expo/vector-icons/Ionicons";

const GuessClubsSelection = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const { footballers, isLoading, error } = useAppSelector(
    (state) => state.data
  );
  const hasTriedLoading = useRef(false);

  // Load data if not already loaded (only once)
  useEffect(() => {
    if (footballers.length === 0 && !isLoading && !hasTriedLoading.current) {
      hasTriedLoading.current = true;
      dispatch(loadFootballData());
    }
    // Reset the ref if we successfully loaded data
    if (footballers.length > 0) {
      hasTriedLoading.current = false;
    }
  }, [dispatch, footballers.length, isLoading]);

  const difficulties = [
    {
      id: Difficulty.EASY,
      title: "Easy",
      description: "Famous players with well-known clubs",
      icon: "🟢",
      color: GAME_COLORS.easy,
    },
    {
      id: Difficulty.MEDIUM,
      title: "Medium",
      description: "Popular players with some obscure clubs",
      icon: "🟡",
      color: GAME_COLORS.medium,
    },
    {
      id: Difficulty.HARD,
      title: "Hard",
      description: "Lesser-known players and obscure clubs",
      icon: "🔴",
      color: GAME_COLORS.hard,
    },
    {
      id: Difficulty.VERY_HARD,
      title: "Very Hard",
      description: "Very obscure footballers and unknown clubs",
      icon: "⚫",
      color: GAME_COLORS.very_hard,
    },
  ];

  const handleDifficultyPress = async (difficulty: Difficulty) => {
    // If data is loading, wait for it
    if (isLoading) {
      Alert.alert("Loading", "Please wait while we load the game data...");
      return;
    }

    // If no data and not loading, try to load it
    let currentFootballers = footballers;
    if (currentFootballers.length === 0) {
      if (error) {
        Alert.alert(
          "Error",
          "Failed to load game data. Please check your connection and try again."
        );
        return;
      }
      // Try loading data
      try {
        const result = await dispatch(loadFootballData()).unwrap();
        currentFootballers = result.footballers;
      } catch (err) {
        Alert.alert(
          "Error",
          "Failed to load game data. Please check your connection and try again."
        );
        return;
      }
    }

    const filteredFootballers = getFootballersByDifficulty(
      currentFootballers,
      difficulty
    );

    // Debug logging
    console.log(`Total footballers: ${currentFootballers.length}`);
    console.log(`Filtering for difficulty: ${difficulty}`);
    console.log(`Filtered footballers: ${filteredFootballers.length}`);
    if (currentFootballers.length > 0) {
      const difficulties = currentFootballers.map((f) => f.difficulty);
      const uniqueDifficulties = [...new Set(difficulties)];
      console.log(`Available difficulties in data:`, uniqueDifficulties);
    }

    if (filteredFootballers.length === 0) {
      Alert.alert(
        "No Players Available",
        `There are no players available for ${difficulty} difficulty at the moment.`
      );
      return;
    }
    const questions = shuffleArray(filteredFootballers).slice(0, 10);

    dispatch(
      startGame({
        game: GameId.GUESS_CLUBS,
        difficulty,
        questions,
      })
    );

    navigation.navigate(ROUTE.GUESS_CLUBS);
  };

  const renderDifficultyItem = ({
    item,
  }: {
    item: (typeof difficulties)[0];
  }) => (
    <TouchableOpacity
      style={[styles.difficultyButton, { borderColor: item.color }]}
      onPress={() => handleDifficultyPress(item.id as Difficulty)}
    >
      <View style={styles.difficultyIcon}>
        <Text style={styles.iconText}>{item.icon}</Text>
      </View>
      <View style={styles.difficultyContent}>
        <Text style={styles.difficultyTitle}>{item.title}</Text>
        <Text style={styles.difficultyDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[
        GAME_COLORS.guess_clubs_gradient_start,
        GAME_COLORS.guess_clubs_gradient_end,
      ]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Guess the Clubs</Text>
          <Text style={styles.headerSubtitle}>
            Choose your difficulty level
          </Text>
        </View>

        {isLoading && footballers.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={GAME_COLORS.text_white} />
            <Text style={styles.loadingText}>Loading game data...</Text>
          </View>
        ) : (
          <FlatList
            data={difficulties}
            renderItem={renderDifficultyItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.difficultiesContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You'll be given a footballer and need to name all the clubs they've
            played for!
          </Text>
        </View>
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
  header: {
    alignItems: Layout.CENTER,
    marginBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    position: "absolute",
    left: 15,
    padding: 5,
    zIndex: 1,
    top: 0,
  },
  backButtonText: {
    ...BODY_FONT,
    fontSize: 16,
    color: GAME_COLORS.text_white,
    fontWeight: "bold",
  },
  headerTitle: {
    ...LOGO_FONT,
    fontSize: 28,
    marginBottom: 8,
    textAlign: Layout.CENTER,
  },
  headerSubtitle: {
    ...BODY_FONT,
    fontSize: 16,
    textAlign: Layout.CENTER,
    opacity: 0.9,
  },
  difficultiesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for footer
  },
  difficultyButton: {
    flexDirection: "row",
    alignItems: Layout.CENTER,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    minHeight: 100,
    marginBottom: 16,
  },
  difficultyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: Layout.CENTER,
    justifyContent: Layout.CENTER,
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  difficultyContent: {
    flex: 1,
  },
  difficultyTitle: {
    ...LOGO_FONT,
    fontSize: 20,
    marginBottom: 8,
  },
  difficultyDescription: {
    ...BODY_FONT,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  timeLimit: {
    ...BODY_FONT,
    fontSize: 12,
    opacity: 0.8,
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: Layout.CENTER,
    paddingHorizontal: 20,
  },
  footerText: {
    ...BODY_FONT,
    fontSize: 12,
    textAlign: Layout.CENTER,
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: Layout.CENTER,
    justifyContent: Layout.CENTER,
    paddingVertical: 40,
  },
  loadingText: {
    ...BODY_FONT,
    fontSize: 16,
    marginTop: 16,
    opacity: 0.9,
  },
});

export default GuessClubsSelection;
