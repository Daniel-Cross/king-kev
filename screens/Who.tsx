import { LinearGradient } from "expo-linear-gradient";
import {
  Animated,
  BackHandler,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../components/atoms/Header";
import { KEGGY, OWEN } from "../constants/quotes";
import { useEffect, useMemo, useState } from "react";
import QuitModal from "../components/molecules/QuitModal";
import { LOGO_FONT } from "../constants/typography";

const Who = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const positionAnim = useState(new Animated.Value(0))[0];

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

    return () => backHandler.remove(); // Cleanup on unmount
  }, [answers]);

  const shuffleArrays = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i - 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const randomKeggy = shuffleArrays([...KEGGY]);
  const randomOwen = shuffleArrays([...OWEN]);

  const quoteArray1 = randomKeggy
    .filter((item) => item.type === "quote")
    .slice(0, 5)
    .map((item) => ({ ...item, answer: "KEGGY" }));
  const quoteArray2 = randomOwen
    .filter((item) => item.type === "quote")
    .slice(0, 5)
    .map((item) => ({ ...item, answer: "OWEN" }));

  const combinedQuoteArray = [...quoteArray1, ...quoteArray2];

  // Randomize the order of "quote" type objects
  const finalRandomizedArray = useMemo(
    () => shuffleArrays([...combinedQuoteArray]),
    []
  );

  const handleAnswer = (userAnswer: string) => {
    Animated.timing(positionAnim, {
      toValue: -1000,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      positionAnim.setValue(1000);

      const correctAnswer = finalRandomizedArray[currentIndex].answer;
      const answerResult =
        userAnswer === correctAnswer ? "correct" : "incorrect";
      setAnswers([...answers, answerResult]);

      if (currentIndex < finalRandomizedArray.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setGameEnded(true);
      }
      Animated.timing(positionAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const numberOfCorrectAnswers = answers.filter(
    (answer) => answer === "correct"
  ).length;

  return (
    <>
      <Header
        setShowModal={setShowModal}
        answers={answers}
        handleAnswer={handleAnswer}
        gameEnded={gameEnded}
        currentIndex={currentIndex}
      />
      <LinearGradient colors={["#FB5FA1", "#F4AA60"]} style={styles.container}>
        <SafeAreaView>
          <View style={styles.contentContainer}>
            {gameEnded ? (
              <Text style={styles.quote}>
                Game Over! You got {numberOfCorrectAnswers} out of 10 correct!
              </Text>
            ) : (
              <>
                <Animated.View
                  style={{
                    ...styles.quoteContainer,
                    transform: [{ translateX: positionAnim }],
                  }}
                >
                  <Text style={styles.quote}>
                    {finalRandomizedArray[currentIndex].quote}
                  </Text>
                </Animated.View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleAnswer("KEGGY")}
                  >
                    <Image
                      source={require("../assets/keggyThumb.png")}
                      style={styles.thumbImage}
                    />
                    <Text style={styles.buttonText}>Keggy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleAnswer("OWEN")}
                  >
                    <Image
                      source={require("../assets/owenThumb.png")}
                      style={styles.thumbImage}
                    />
                    <Text style={styles.buttonText}>Owen</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
      <QuitModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "88%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quoteContainer: {
    flex: 1,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    borderWidth: 2,
    borderColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  quote: {
    textAlign: "center",
    marginBottom: 20,
    ...LOGO_FONT,
  },
  buttonText: {
    ...LOGO_FONT,
  },
  thumbImage: {
    height: 120,
    width: 120,
    borderRadius: 100,
  },
});

export default Who;
