import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useGetUser } from "api";
import {
  ActivityDetails,
  CreateWorkout,
  Home,
  Notifications,
  Register,
} from "features";
import React from "react";
import { useStore } from "store";
import { Theme } from "tamagui";

import { AssetLoader } from "./assetLoader";
import { MainHeader } from "../components/mainHeader";
import { DrawerStack } from "../drawerStack";
import { LoadingMessage } from "./loadingMessage";

const Stack = createNativeStackNavigator<MainStackParams>();

export const MainStack = () => {
  const [assetProgress, setAssetProgress] = React.useState({ current: -1, total: 0 });

  const { userId } = useStore();
  const { data: user } = useGetUser();

  const userIsLoggedIn = user && (userId ?? -1) >= 0;

  if (assetProgress.current < assetProgress.total) {
    return <AssetLoader progress={assetProgress} setProgress={setAssetProgress} />;
  }

  if (!userIsLoggedIn) {
    return <LoadingMessage title="Logging in..." />;
  }

  return (
    <Theme name={user?.userSettings?.darkMode ? "dark" : "light"}>
      <Stack.Navigator
        screenOptions={{
          header: (props) => (
            <MainHeader
              name={props.route.name}
              loggedIn={userIsLoggedIn}
              onBackPress={() => props.navigation.goBack()}
            />
          ),
        }}
      >
        {userIsLoggedIn && (
          <Stack.Group>
            <Stack.Screen
              name="Drawer"
              component={DrawerStack}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Create" component={CreateWorkout} />
            <Stack.Screen
              name="Activity"
              component={ActivityDetails}
              initialParams={{ mainActivityId: 0 }}
            />
            <Stack.Screen name="Notifications" component={Notifications} />
          </Stack.Group>
        )}

        {!userIsLoggedIn && (
          <Stack.Group>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{
                headerBackVisible: false,
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </Theme>
  );
};
