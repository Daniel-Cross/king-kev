import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { BODY_FONT, LOGO_FONT } from "../constants/typography";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout, GameId } from "../constants/enums";
import { ROUTE } from "../constants/constants";
import { GAME_COLORS } from "../constants/colours";

const GameSelection = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const games = [
    {
      id: GameId.WHO_SAID_IT,
      title: "Who Said It?",
      description:
        "Know a Keggy quote when you see one? Test your knowledge of Kevin Keegan and Michael Owen quotes.",
      icon: "💬",
      color: GAME_COLORS.who_said_it,
    },
    {
      id: GameId.GUESS_CLUBS,
      title: "Guess the Clubs",
      description:
        "Given a footballer, name all the clubs they've played for. Test your football knowledge!",
      icon: "⚽",
      color: GAME_COLORS.guess_clubs,
    },
  ];

  const handleGamePress = (gameId: string) => {
    if (gameId === GameId.WHO_SAID_IT) {
      navigation.navigate(ROUTE.WHO_INTRODUCTION);
    } else if (gameId === GameId.GUESS_CLUBS) {
      navigation.navigate(ROUTE.GUESS_CLUBS_SELECTION);
    }
  };

  const renderGameItem = ({ item }: { item: (typeof games)[0] }) => (
    <TouchableOpacity
      style={[styles.gameButton, { borderColor: item.color }]}
      onPress={() => handleGamePress(item.id)}
    >
      <View style={styles.gameIcon}>
        <Text style={styles.iconText}>{item.icon}</Text>
      </View>
      <View style={styles.gameContent}>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gameDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[GAME_COLORS.gradient_start, GAME_COLORS.gradient_end]}
      style={styles.container}
    >
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose Your Game</Text>
          <Text style={styles.headerSubtitle}>
            Pick a game and test your football knowledge!
          </Text>
        </View>

        <FlatList
          data={games}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gamesContainer}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: Layout.CENTER,
    justifyContent: Layout.CENTER,
  },
  header: {
    alignItems: Layout.CENTER,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  headerTitle: {
    ...LOGO_FONT,
    fontSize: 28,
    marginBottom: 8,
    textAlign: Layout.CENTER,
  },
  headerSubtitle: {
    ...BODY_FONT,
    fontSize: 16,
    textAlign: Layout.CENTER,
    opacity: 0.9,
  },
  gamesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for footer
  },
  gameButton: {
    flexDirection: "row",
    alignItems: Layout.CENTER,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    minHeight: 100,
    marginBottom: 16,
  },
  gameIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: Layout.CENTER,
    justifyContent: Layout.CENTER,
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  gameContent: {
    flex: 1,
  },
  gameTitle: {
    ...LOGO_FONT,
    fontSize: 20,
    marginBottom: 8,
  },
  gameDescription: {
    ...BODY_FONT,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default GameSelection;
