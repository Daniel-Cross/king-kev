import { LinearGradient } from "expo-linear-gradient";
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import QuitModal from "../components/molecules/QuitModal";
import { LOGO_FONT, BODY_FONT } from "../constants/typography";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setAnswer,
  nextQuestion,
  updateScore,
  setTimeLeft,
  endGame,
  quitGame,
} from "../store/gameSlice";
import { ROUTE } from "../constants/constants";
import { GAME_COLORS } from "../constants/colours";
import {
  generateClubOptions,
  arraysEqual,
  formatTime,
} from "../helpers/gameHelpers";
import Ionicons from "@expo/vector-icons/Ionicons";

const GuessClubs = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const {
    currentIndex,
    answers,
    gameEnded,
    timeLeft,
    score,
    questions,
    totalQuestions,
  } = useAppSelector((state) => state.game);

  const [showModal, setShowModal] = useState(false);
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
  const [availableClubs, setAvailableClubs] = useState<string[]>([]);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);

  const currentFootballer = questions[currentIndex];

  // Generate club options when current footballer changes
  useEffect(() => {
    const options = generateClubOptions(currentFootballer);
    setAvailableClubs(options);
    setSelectedClubs([]); // Reset selected clubs for new question
    setIsProcessingAnswer(false); // Reset processing state
  }, [currentIndex, currentFootballer]);

  useEffect(() => {
    const backAction = () => {
      if (answers.length > 0) {
        setShowModal(true);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [answers]);

  useEffect(() => {
    if (timeLeft > 0 && !gameEnded) {
      const timer = setTimeout(() => dispatch(setTimeLeft(timeLeft - 1)), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameEnded) {
      handleTimeUp();
    }
  }, [timeLeft, gameEnded, dispatch]);

  // Handle game end
  useEffect(() => {
    if (gameEnded) {
      handleEndGame();
    }
  }, [gameEnded]);

  const handleTimeUp = () => {
    dispatch(setAnswer([])); // Empty answer for time up

    if (currentIndex + 1 >= totalQuestions) {
      dispatch(endGame());
    } else {
      dispatch(nextQuestion());
    }
  };

  // Function to handle club selection/deselection
  const toggleClubSelection = (clubName: string) => {
    setSelectedClubs((prev) => {
      // Don't allow deselection - once selected, it stays selected
      if (prev.includes(clubName)) {
        return prev; // Return unchanged if already selected
      }

      // Add the new selection
      const newSelection = [...prev, clubName];

      // If we've reached the required number of selections, submit automatically
      if (newSelection.length === currentFootballer.clubs.length) {
        setIsProcessingAnswer(true);
        handleAnswer(newSelection);
      }

      return newSelection;
    });
  };

  const handleAnswer = (finalSelection?: string[]) => {
    const selection = finalSelection || selectedClubs;
    const correctClubs = currentFootballer.clubs.map((club) => club.name);
    const isCorrect = arraysEqual(selection.sort(), correctClubs.sort());

    dispatch(setAnswer(selection));

    if (isCorrect) {
      dispatch(updateScore(score + 1));
    }

    if (currentIndex + 1 >= totalQuestions) {
      dispatch(endGame());
    } else {
      dispatch(nextQuestion());
    }
  };

  const handleEndGame = () => {
    setShowModal(false);

    // Navigate to score screen
    navigation.navigate(ROUTE.SCORE);
  };

  // Don't render if game data is invalid
  if (!questions || questions.length === 0 || !currentFootballer) {
    return null;
  }

  return (
    <LinearGradient
      colors={[
        GAME_COLORS.guess_clubs_gradient_start,
        GAME_COLORS.guess_clubs_gradient_end,
      ]}
      style={styles.container}
    >
      <SafeAreaView>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.closeButton}
        >
          <Ionicons name="close-outline" size={30} color="white" />
        </TouchableOpacity>

        <View style={styles.gameInfo}>
          <Text style={styles.questionNumber}>
            Question {currentIndex + 1} of {totalQuestions}
          </Text>
          <Text
            style={[
              styles.timer,
              {
                color:
                  timeLeft <= 10 ? GAME_COLORS.danger : GAME_COLORS.text_white,
              },
            ]}
          >
            {formatTime(timeLeft)}
          </Text>
          <Text style={styles.score}>Score: {score}</Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>
            Name all the clubs that {currentFootballer.name} has played for:
          </Text>

          <View style={styles.footballerInfo}>
            <Text style={styles.footballerDetails}>
              {currentFootballer.position} • {currentFootballer.nationality}
            </Text>
          </View>

          <View style={styles.clubsContainer}>
            <Text style={styles.clubsTitle}>
              Select {currentFootballer.clubs.length} club
              {currentFootballer.clubs.length !== 1 ? "s" : ""} (
              {selectedClubs.length}/{currentFootballer.clubs.length} selected):
            </Text>
            <FlatList
              data={availableClubs}
              renderItem={({ item: clubName }) => {
                const isSelected = selectedClubs.includes(clubName);
                const isCorrect = currentFootballer.clubs.some(
                  (club) => club.name === clubName
                );
                return (
                  <TouchableOpacity
                    style={[
                      styles.clubItem,
                      isSelected && styles.selectedClubItem,
                      isSelected &&
                        isCorrect &&
                        !isProcessingAnswer &&
                        styles.correctClubItem,
                      isSelected &&
                        !isCorrect &&
                        !isProcessingAnswer &&
                        styles.wrongClubItem,
                    ]}
                    onPress={() => toggleClubSelection(clubName)}
                  >
                    <Text
                      style={[
                        styles.clubText,
                        isSelected && styles.selectedClubText,
                      ]}
                    >
                      {clubName}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(clubName, index) => `${clubName}-${index}`}
              numColumns={2}
              contentContainerStyle={styles.clubsList}
            />
          </View>
        </View>

        <QuitModal
          showModal={showModal}
          setShowModal={setShowModal}
          onQuit={() => {
            dispatch(quitGame());
            navigation.replace(ROUTE.GAME_SELECTION);
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20, // Add some space below the header
  },
  questionNumber: {
    ...BODY_FONT,
    fontSize: 16,
    fontWeight: "bold",
  },
  timer: {
    ...BODY_FONT,
    fontSize: 18,
    fontWeight: "bold",
  },
  score: {
    ...BODY_FONT,
    fontSize: 16,
    fontWeight: "bold",
  },
  questionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    minHeight: 200,
  },
  questionTitle: {
    ...LOGO_FONT,
    fontSize: 24,
    textAlign: "center",
    height: 120,
  },
  footballerInfo: {
    alignItems: "center",
    marginBottom: 10,
    height: 20,
  },
  footballerDetails: {
    ...BODY_FONT,
    fontSize: 16,
    opacity: 0.8,
  },
  clubsContainer: {
    flexGrow: 1,
    marginBottom: 10,
  },
  clubsTitle: {
    ...BODY_FONT,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    height: 20,
  },
  clubsList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  clubItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    marginHorizontal: 3,
    marginVertical: 3,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedClubItem: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  correctClubItem: {
    backgroundColor: "rgba(76, 175, 80, 0.3)",
    borderColor: "rgba(76, 175, 80, 0.8)",
  },
  wrongClubItem: {
    backgroundColor: "rgba(244, 67, 54, 0.3)",
    borderColor: "rgba(244, 67, 54, 0.8)",
  },
  clubText: {
    ...BODY_FONT,
    fontSize: 14,
  },
  selectedClubText: {
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
  },
});

export default GuessClubs;
