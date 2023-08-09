import {
  NavigationContainer,
  NavigationProp,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigation from "./TabNavigation";

type MainStackParamList = {
  Home: undefined;
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
