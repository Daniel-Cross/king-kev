import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BODY_FONT, LOGO_FONT } from "../constants/typography";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ROUTE } from "../constants/constants";
import { GAME_COLORS } from "../constants/colours";

const WhoIntroduction = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <LinearGradient
      colors={[GAME_COLORS.gradient_start, GAME_COLORS.gradient_end]}
      style={styles.container}
    >
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          style={styles.introContainer}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Who Said It?</Text>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/keggyThumb.jpg")}
              style={styles.thumbImage}
            />
            <Text style={styles.title}>VS</Text>
            <Image
              source={require("../assets/owenThumb.png")}
              style={styles.thumbImage}
            />
          </View>
          <Text style={styles.body}>
            There have been many great philosophers throughout history, but none
            quite as insightful as Kevin Keegan or Michael Owen. Minds so
            brilliant that only they can possibly comprehend their own genius.
          </Text>
          <Text style={styles.body}>
            Can you tell the difference between the two?
          </Text>
          <Text style={styles.body}>
            You'll be shown 10 different quotes and you'll be given 10 seconds
            to answer each question.
          </Text>
          <Text style={styles.body}>Good luck!</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(ROUTE.WHO)}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </ScrollView>
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
  introContainer: {
    height: "100%",
    width: "88%",
    marginBottom: 40,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    alignItems: "center",
    marginVertical: 16,
  },
  title: { ...LOGO_FONT, marginTop: 16 },
  button: {
    height: 60,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: GAME_COLORS.text_white,
    marginTop: 16,
  },
  buttonText: { ...LOGO_FONT },
  body: { ...BODY_FONT, paddingVertical: 16, textAlign: "left" },
  thumbImage: {
    height: 120,
    width: 120,
    borderRadius: 100,
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 5,
    zIndex: 1,
    top: 0,
  },
});

export default WhoIntroduction;
