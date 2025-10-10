import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BODY_FONT, LOGO_FONT } from "../constants/typography";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { ROUTE } from "../constants/constants";
import { GAME_COLORS } from "../constants/colours";

const Game = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <LinearGradient
      colors={[GAME_COLORS.gradient_start, GAME_COLORS.gradient_end]}
      style={styles.container}
    >
      <SafeAreaView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(ROUTE.GAME_SELECTION)}
          >
            <Text style={styles.title}>Play Games</Text>
            <Text style={styles.body}>
              Choose from our collection of football games including "Who Said
              It?" and "Guess the Clubs"
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
    borderColor: GAME_COLORS.text_white,
  },
  body: { ...BODY_FONT, padding: 8, textAlign: "center" },
});

export default Game;
