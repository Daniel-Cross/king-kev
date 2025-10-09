import { LinearGradient } from "expo-linear-gradient";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LOGO_FONT } from "../constants/typography";
import { KEGGY, KeggyProps } from "../constants/quotes";
import { useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { width } from "../constants/constants";
import { Audio } from "expo-av";
import { useIsFocused } from "@react-navigation/native";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import {
  randomiseQuotes,
  getNextQuotes,
  handleQuoteScroll,
} from "../helpers/quoteHelpers";
import {
  QuoteType,
  IconName,
  Color,
  ImageSize,
  Layout,
} from "../constants/enums";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  trackHeartPress,
  getHeartCount,
  hasUserHearted,
  subscribeToHeartCounts,
  initializeHeartCounts,
} from "../helpers/analyticsHelpers";

const Home = () => {
  const [hideIcons, setHideIcons] = useState(false);
  const [randomisedKEGGY, setRandomisedKEGGY] = useState<KeggyProps[]>([]);
  const [displayedQuotes, setDisplayedQuotes] = useState<Set<number>>(
    new Set()
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heartCounts, setHeartCounts] = useState<{ [key: number]: number }>({});
  const [userHearts, setUserHearts] = useState<{ [key: number]: boolean }>({});
  const viewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const focused = useIsFocused();
  const soundObject = useRef(new Audio.Sound()).current;

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (!focused) {
      soundObject.unloadAsync();
    }
  }, [focused]);

  useEffect(() => {
    setRandomisedKEGGY(randomiseQuotes(KEGGY as KeggyProps[]));
    setDisplayedQuotes(new Set());
    setCurrentIndex(0);
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize heart counts in global storage (only runs once)
      await initializeHeartCounts();

      // Load user's heart history locally
      await loadUserHearts();

      // Set up real-time listener for global heart counts
      const unsubscribe = subscribeToHeartCounts((counts) => {
        setHeartCounts(counts);
      });

      // Cleanup listener when component unmounts
      return unsubscribe;
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  };

  const loadUserHearts = async () => {
    try {
      const hearts: { [key: number]: boolean } = {};
      for (const quote of KEGGY) {
        hearts[quote.id] = await hasUserHearted(quote.id);
      }
      setUserHearts(hearts);
    } catch (error) {
      console.error("Error loading user hearts:", error);
    }
  };

  const getNextQuotesHandler = () => {
    return getNextQuotes(
      KEGGY as KeggyProps[],
      displayedQuotes,
      setRandomisedKEGGY,
      setDisplayedQuotes
    );
  };

  const handleScroll = (event: any) => {
    handleQuoteScroll(
      event,
      width,
      currentIndex,
      randomisedKEGGY,
      setCurrentIndex,
      setDisplayedQuotes,
      getNextQuotesHandler
    );
  };

  const handleHeartPress = async (id: number) => {
    const isCurrentlyHearted = userHearts[id] || false;
    const newHeartState = !isCurrentlyHearted;

    try {
      // Update heart count globally
      const newCount = await trackHeartPress(id, newHeartState);

      // Update local state
      setHeartCounts((prev) => ({
        ...prev,
        [id]: newCount,
      }));

      setUserHearts((prev) => ({
        ...prev,
        [id]: newHeartState,
      }));

      // Play sound
      await soundObject.unloadAsync();

      if (newHeartState) {
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
    } catch (error) {
      console.error("Error handling heart press:", error);
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
      colors={[Color.GRADIENT_START, Color.GRADIENT_END]}
      style={styles.container}
      ref={viewRef}
    >
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={{
            justifyContent: Layout.CENTER,
            alignItems: Layout.CENTER,
            flexGrow: 1,
          }}
          style={{ flex: 1 }}
        >
          <Animated.FlatList
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true, listener: handleScroll }
            )}
            data={randomisedKEGGY}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            renderItem={({ item }) => {
              return (
                <View style={styles.quoteContainer}>
                  {item.type === QuoteType.QUOTE && (
                    <Text style={styles.text}>{item.quote}</Text>
                  )}
                  {item.type === QuoteType.IMAGE && (
                    <Image
                      source={item.quote as any}
                      style={{ width: ImageSize.IMAGE_WIDTH, height: "100%" }}
                    />
                  )}
                  <View style={styles.shareButtons}>
                    {!hideIcons && (
                      <>
                        <View style={styles.heartContainer}>
                          <TouchableOpacity
                            onPress={() => handleHeartPress(item.id)}
                          >
                            <Ionicons
                              name={
                                userHearts[item.id]
                                  ? IconName.HEART_FILLED
                                  : IconName.HEART_OUTLINE
                              }
                              size={ImageSize.ICON_SIZE}
                              color={
                                userHearts[item.id]
                                  ? Color.HEART_RED
                                  : Color.WHITE
                              }
                            />
                          </TouchableOpacity>
                          {heartCounts[item.id] > 0 && (
                            <Text style={styles.heartCount}>
                              {heartCounts[item.id]}
                            </Text>
                          )}
                        </View>

                        <TouchableOpacity onPress={() => handleShare()}>
                          <Ionicons
                            name={IconName.SHARE_OUTLINE}
                            size={ImageSize.ICON_SIZE}
                            color={Color.WHITE}
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              );
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  text: { ...LOGO_FONT, width: "88%", textAlign: "center" },
  quoteContainer: {
    height: "100%",
    width,
    justifyContent: Layout.CENTER,
    alignItems: Layout.CENTER,
  },
  shareButtons: {
    marginTop: 30,
    justifyContent: "space-between",
    width: 150,
    flexDirection: Layout.ROW,
  },
  heartContainer: {
    alignItems: Layout.CENTER,
    justifyContent: Layout.CENTER,
  },
  heartCount: {
    color: Color.WHITE,
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
    textAlign: Layout.CENTER,
  },
});

export default Home;
