import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, StyleSheet, Text } from "react-native";

const Game = () => {
  return (
    <LinearGradient colors={["#FB5FA1", "#F4AA60"]} style={styles.container}>
      <SafeAreaView>
        <Text>GAME</Text>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});

export default Game;
