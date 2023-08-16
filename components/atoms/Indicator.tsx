import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { KEGGY } from "../../constants/quotes";
import { width } from "../../constants/constants";

const Indicator = ({ scrollX }: { scrollX: Animated.Value }) => {
  return (
    <View style={styles.indicatorContainer}>
      {KEGGY.map((_: any, i: number) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1.4, 0.8],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={i}
            style={[styles.indicator, { transform: [{ scale }] }]}
          />
        );
      })}
    </View>
  );
};

export default Indicator;

const styles = StyleSheet.create({
  indicatorContainer: {
    position: "absolute",
    bottom: 100,
    flexDirection: "row",
    width,
  },
  indicator: {
    height: 5,
    width: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
    margin: 10,
  },
});
