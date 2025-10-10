import {
  NavigationContainer,
  NavigationProp,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigation from "./TabNavigation";
import Who from "../screens/Who";
import WhoIntroduction from "../screens/WhoIntroduction";
import GameSelection from "../screens/GameSelection";
import GuessClubsSelection from "../screens/GuessClubsSelection";
import GuessClubs from "../screens/GuessClubs";
import ScoreScreen from "../screens/ScoreScreen";

type MainStackParamList = {
  Home: undefined;
  GameSelection: undefined;
  WhoIntroduction: undefined;
  Who: undefined;
  GuessClubsSelection: undefined;
  GuessClubs: undefined;
  Score: undefined;
};

interface HomeScreenProps {
  navigation: NavigationProp<any, any>;
}

const MainStack = createNativeStackNavigator<MainStackParamList>();
const navigationRef = createNavigationContainerRef<HomeScreenProps>();

const Routes = () => {
  const MainStackScreens = () => {
    return (
      <MainStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <MainStack.Screen name="Home" component={TabNavigation} />
        <MainStack.Screen name="GameSelection" component={GameSelection} />
        <MainStack.Screen name="WhoIntroduction" component={WhoIntroduction} />
        <MainStack.Screen name="Who" component={Who} />
        <MainStack.Screen
          name="GuessClubsSelection"
          component={GuessClubsSelection}
        />
        <MainStack.Screen name="GuessClubs" component={GuessClubs} />
        <MainStack.Screen name="Score" component={ScoreScreen} />
      </MainStack.Navigator>
    );
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <MainStackScreens />
    </NavigationContainer>
  );
};

export default Routes;
