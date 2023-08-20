import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { LOGO_FONT } from "../../constants/typography";

interface HeaderProps {
  setShowModal: (value: boolean) => void;
  answers: string[];
  gameEnded: boolean;
  handleAnswer: (answer: string) => void;
  currentIndex: number;
}

const Header = ({
  setShowModal,
  answers,
  gameEnded,
  handleAnswer,
  currentIndex,
}: HeaderProps) => {
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    if (gameEnded) return;

    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    if (timer === 0) {
      handleAnswer("timeout");
    }

    return () => clearInterval(countdown);
  }, [timer, gameEnded]);

  useEffect(() => {
    setTimer(10);
  }, [currentIndex]);

  const handleBack = () => {
    if (setShowModal && answers.length > 0 && !gameEnded) {
      setShowModal(true);
    } else {
      navigation.goBack();
    }
  };

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleBack()} style={styles.backButton}>
        <Ionicons name="close-outline" size={30} color="white" />
      </TouchableOpacity>
      {!gameEnded && <Text style={styles.timer}>{timer}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 30,
    zIndex: 1,
  },
  backButton: {
    position: "absolute",
    right: 30,
    padding: 5,
  },
  timer: {
    ...LOGO_FONT,
    fontSize: 40,
    position: "absolute",
    top: 30,
  },
});

export default Header;
