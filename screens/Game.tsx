import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BODY_FONT, LOGO_FONT } from "../constants/typography";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Game = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <LinearGradient colors={["#FB5FA1", "#F4AA60"]} style={styles.container}>
      <SafeAreaView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("WhoIntroduction")}
          >
            <Text style={styles.title}>Who Said It?</Text>
            <Text style={styles.body}>
              Know a Keggy quote when you see one? Put your knowledge to the
              test and become the envy of your friends and the most interesting
              person in the room at parties
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.title}>Guess Who?</Text>
            <Text style={styles.body}>
              Receive some clues and guess who the player is before the time
              runs out.
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "100%",
  },
  title: { ...LOGO_FONT, marginTop: 16 },
  button: {
    height: "35%",
    width: 320,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  body: { ...BODY_FONT, padding: 8, textAlign: "center" },
});

export default Game;
