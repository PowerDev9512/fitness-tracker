import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useGetUser } from "api";
import { Loading } from "components";
import {
  ActivityDetails,
  CreateWorkout,
  Home,
  Notifications,
  Register,
} from "features";
import React, { useEffect } from "react";
import { useStore } from "store";

import { AssetLoader } from "./components/assetLoader";
import { DrawerStack } from "./drawerStack";

const Stack = createNativeStackNavigator<MainStackParams>();

export const MainStack = () => {
  const [progress, setProgress] = React.useState({ current: -1, total: 0 });

  const { userId } = useStore();
  const { data: user, isLoading: userLoading } = useGetUser();
  const userIsLoggedIn =
    user !== undefined && userId !== undefined && userId >= 0;

  useEffect(() => {
    const darkMode = user?.userSettings?.darkMode ?? false;
  }, [user?.userSettings?.darkMode]);

  if (progress.current < progress.total) {
    return <AssetLoader progress={progress} setProgress={setProgress} />;
  }

  if (userId && userLoading) {
    return <Loading />;
  }

  return (
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
  );
};
