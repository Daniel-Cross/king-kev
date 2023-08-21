import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { IS_IOS, ROUTE } from "../constants/constants";
import { PRIMARY } from "../constants/colours";
import Home from "../screens/Home";
import Game from "../screens/Game";
import Favourites from "../screens/Favourites";
import WhoIntroduction from "../screens/WhoIntroduction";

type TabParamList = {
  HOME: undefined;
  FAVOURITES: undefined;
  GAME: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // tabBarHideOnKeyboard: IS_IOS() ? false : true,
        headerShown: false,
        gestureEnabled: false,
        tabBarActiveTintColor: "#5F7AE0",
        tabBarInactiveTintColor: PRIMARY.white,
        tabBarStyle: {
          height: IS_IOS() ? 80 : 60,
          borderTopWidth: 0,
          position: "absolute",
          paddingTop: 10,
          backgroundColor: "transparent",
          elevation: 0,
        },
        tabBarIcon: ({ color }) => {
          let iconName: any;

          if (route.name === ROUTE.HOME) {
            iconName = "home-outline";
          }
          if (route.name === ROUTE.FAVOURITES) {
            iconName = "ios-heart-outline";
          }
          if (route.name === ROUTE.GAME) {
            iconName = "game-controller-outline";
          }
          return <Ionicons name={iconName} size={25} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HOME"
        component={Home}
        options={{ tabBarShowLabel: false }}
      />
      <Tab.Screen
        name="FAVOURITES"
        component={Favourites}
        options={{ tabBarShowLabel: false }}
      />
      <Tab.Screen
        name="GAME"
        component={WhoIntroduction}
        options={{ tabBarShowLabel: false }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
