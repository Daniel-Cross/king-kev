import { Image, StyleSheet, Text, View } from "react-native";
import { BODY_FONT_BOLD } from "../../constants/typography";

const EmptyState = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/keeganFavourites.png")}
        style={styles.image}
      />
      <Text style={styles.text}>
        Looks like you don't have any favourite quotes yet.
      </Text>
      <Text style={styles.text}>
        My dad's favourite quote was "Don't put all your eggs in one basket,
        son." But I had 11 of my dozen in one basket and one in the other...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  text: { ...BODY_FONT_BOLD, width: "30%", textAlign: "center", margin: 20 },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 100,
  },
});

export default EmptyState;
