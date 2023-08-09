import { LinearGradient } from "expo-linear-gradient";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LOGO_FONT } from "../constants/typography";
import { KEGGY } from "../constants/quotes";
import { useRef } from "react";

const width = Dimensions.get("window").width;

const Home = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

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

  return (
    <LinearGradient colors={["#FB5FA1", "#F4AA60"]} style={styles.container}>
      <SafeAreaView>
        <Animated.FlatList
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          data={KEGGY}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          renderItem={({ item }) => {
            return (
              <View style={styles.quoteContainer}>
                <Text style={styles.logo}>{item}</Text>
              </View>
            );
          }}
        />
        <Indicator scrollX={scrollX} />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  logo: { ...LOGO_FONT, width: "88%", textAlign: "center" },
  crown: {
    position: "absolute",
    top: 3,
    left: 47,
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 100,
    flexDirection: "row",
    width,
    flexWrap: "wrap",
  },
  indicator: {
    height: 5,
    width: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
    margin: 10,
  },
  quoteContainer: {
    height: "100%",
    width,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
