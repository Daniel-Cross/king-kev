import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { resetGame } from "../store/gameSlice";
import { LOGO_FONT, BODY_FONT } from "../constants/typography";
import { GAME_COLORS } from "../constants/colours";
import { SafeAreaView } from "react-native-safe-area-context";

const ScoreScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const { answers, questions, score } = useAppSelector((state) => state.game);

  if (!answers || !questions || questions.length === 0) {
    return (
      <LinearGradient
        colors={[
          GAME_COLORS.guess_clubs_gradient_start,
          GAME_COLORS.guess_clubs_gradient_end,
        ]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Text style={styles.title}>Loading...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Get final score from Redux state
  const finalScore = score || 0;

  const handlePlayAgain = () => {
    dispatch(resetGame());
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "Home",
          params: {
            screen: "GAME",
          },
        },
      ],
    });
  };

  return (
    <LinearGradient
      colors={[
        GAME_COLORS.guess_clubs_gradient_start,
        GAME_COLORS.guess_clubs_gradient_end,
      ]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Game Over!</Text>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Your Score</Text>
            <Text style={styles.scoreValue}>{finalScore}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={handlePlayAgain}
            >
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    ...LOGO_FONT,
    fontSize: 48,
    color: GAME_COLORS.text_white,
    textAlign: "center",
    marginBottom: 40,
  },
  scoreContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginBottom: 40,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  scoreLabel: {
    ...BODY_FONT,
    fontSize: 18,
    color: GAME_COLORS.text_white,
    opacity: 0.8,
    marginBottom: 10,
  },
  scoreValue: {
    ...LOGO_FONT,
    fontSize: 72,
    color: GAME_COLORS.text_white,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  playAgainButton: {
    backgroundColor: GAME_COLORS.success,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  buttonText: {
    ...BODY_FONT,
    fontSize: 18,
    color: GAME_COLORS.text_white,
    fontWeight: "bold",
  },
});

export default ScoreScreen;
