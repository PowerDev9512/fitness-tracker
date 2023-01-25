import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useGetUser } from "api";
import { Heading } from "components";
import {
  ActivityDetails,
  CreateWorkout,
  Home,
  Notifications,
  Register,
} from "features";
import React from "react";
import { useStore } from "store";
import { Spinner, Theme, XStack } from "tamagui";

import { AssetLoader } from "./components/assetLoader";
import { DrawerStack } from "./drawerStack";

const Stack = createNativeStackNavigator<MainStackParams>();

export const MainStack = () => {
  const [progress, setProgress] = React.useState({ current: -1, total: 0 });

  const { userId } = useStore();
  const { data: user } = useGetUser();

  const userIsLoggedIn = user && (userId ?? -1) >= 0;

  if (progress.current < progress.total) {
    return <AssetLoader progress={progress} setProgress={setProgress} />;
  }

  if (!userIsLoggedIn) {
    return (
      <XStack alignContent="center" mx="auto" my="auto">
        <Heading color="$primary500" fontSize={16}>
          Logging in...
        </Heading>
        <Spinner accessibilityLabel="Loading page" />
      </XStack>
    );
  }

  return (
    <Theme name={user?.userSettings?.darkMode ? "dark" : "light"}>
      <Stack.Navigator>
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
