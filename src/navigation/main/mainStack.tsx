import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useGetUser } from "api";
import {
  ActivityDetails,
  CreateWorkout,
  Home,
  Notifications,
  Register,
} from "features";
import React, { useEffect } from "react";
import { Theme } from "tamagui";

import { AssetLoader } from "./assetLoader";
import { MainHeader } from "./mainHeader";
import { SideBarStack } from "../sideBar/sideBarStack";
import { LoadingMessage } from "./loadingMessage";
import { useStore } from "store";

const Stack = createNativeStackNavigator<MainStackParams>();

export const MainStack = () => {
  const [assetProgress, setAssetProgress] = React.useState({ current: -1, total: 0 });
  const { data: user, fetchStatus: getUserStatus, refetch: getUser } = useGetUser(true);
  const { userId } = useStore();

  useEffect(() => {
    if (getUserStatus === "idle" && userId !== undefined && userId >= 0) {
      getUser();
    }
  }, [userId]);

  if (assetProgress.current < assetProgress.total) {
    return <AssetLoader progress={assetProgress} setProgress={setAssetProgress} />;
  }

  if (getUserStatus !== "idle" && userId !== undefined && userId >= 0) {
    return <LoadingMessage title="Loading..." />;
  }

  return (
    <Theme name={user?.userSettings?.darkMode ? "dark" : "light"}>
      <Stack.Navigator
        screenOptions={{
          header: (props) => (
            <MainHeader
              name={props.route.name}
              loggedIn={user !== undefined}
              onBackPress={() => props.navigation.goBack()}
            />
          ),
        }}
      >
        {user && (
          <Stack.Group>
            <Stack.Screen
              name="Drawer"
              component={SideBarStack}
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

        {!user && (
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
