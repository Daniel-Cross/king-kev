import { LinearGradient } from "expo-linear-gradient";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LOGO_FONT } from "../constants/typography";
import { KEGGY } from "../constants/quotes";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { width } from "../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { loadFavourites, updateFavourites } from "../redux/favouriteDataSlice";
import { Audio } from "expo-av";
import { useIsFocused } from "@react-navigation/native";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";

const Home = () => {
  const [hideIcons, setHideIcons] = useState(false);
  const viewRef = useRef();
  const dispatch = useDispatch();
  const { favourites } = useSelector((state: RootState) => state.favourites);
  const scrollX = useRef(new Animated.Value(0)).current;
  const focused = useIsFocused();
  const soundObject = useRef(new Audio.Sound()).current;

  useEffect(() => {
    dispatch(loadFavourites());
  }, []);

  useEffect(() => {
    if (!focused) {
      soundObject.unloadAsync();
    }
  }, [focused]);

  const handleAddToFavourites = async (quote: string) => {
    dispatch(updateFavourites(quote));

    try {
      await soundObject.unloadAsync();
    } catch (error) {
      console.error("Error unloading previous sound:", error);
    }

    if (!favourites.includes(quote)) {
      try {
        await soundObject.loadAsync(require("../assets/sounds/loveIt.mp3"));
        await soundObject.playAsync();
      } catch (error) {
        console.error("Error playing loveIt.mp3:", error);
      }
    } else {
      try {
        await soundObject.loadAsync(require("../assets/sounds/ifOnly.mp3"));
        await soundObject.playAsync();
      } catch (error) {
        console.error("Error playing ifOnly.mp3:", error);
      }
    }
  };

  const handleShare = async () => {
    try {
      setHideIcons(true);
      setTimeout(async () => {
        // Capture the screenshot as a URI
        const uri = await captureRef(viewRef, {
          format: "png",
          quality: 0.8,
        });

        // Check if sharing is available
        if (!(await Sharing.isAvailableAsync())) {
          alert(`Uh oh, sharing isn't available on your platform`);
          return;
        }

        // Share the captured image
        await Sharing.shareAsync(uri);
        setHideIcons(false);
      }, 100);
    } catch (error) {
      console.error("Error sharing image:", error);
      setHideIcons(false);
    }
  };

  return (
    <LinearGradient
      colors={["#FB5FA1", "#F4AA60"]}
      style={styles.container}
      ref={viewRef}
    >
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
                <View style={styles.shareButtons}>
                  {!hideIcons && (
                    <>
                      {favourites.includes(item) ? (
                        <TouchableOpacity
                          onPress={() => handleAddToFavourites(item)}
                        >
                          <Ionicons
                            name="ios-heart"
                            size={30}
                            color="#fb3958"
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => handleAddToFavourites(item)}
                        >
                          <Ionicons
                            name="heart-outline"
                            size={30}
                            color="white"
                          />
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity onPress={() => handleShare()}>
                        <Ionicons
                          name="ios-share-outline"
                          size={30}
                          color="white"
                        />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            );
          }}
        />
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

  quoteContainer: {
    height: "100%",
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButtons: {
    marginTop: 30,
    justifyContent: "space-between",
    width: 150,
    flexDirection: "row",
  },
});

export default Home;
