import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { useGetUser, useSignalR } from "api";
import { StatusBar } from "expo-status-bar";
import {
  ActivityDetails,
  CreateWorkout,
  Home,
  Notifications,
  Register,
} from "features";
import React, { useEffect } from "react";
import { useStore } from "store";
import { Theme, useTheme } from "tamagui";
import { Message, User } from "types";

import { LoadingMessage } from "./loadingMessage";
import { MainHeader } from "./mainHeader";
import { SideBarStack } from "../sideBar/sideBarStack";

const Stack = createNativeStackNavigator<MainStackParams>();

export const MainStack = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { connection, isConnected } = useSignalR();
  const { data: user, isLoading: gettingUser } = useGetUser();
  const { setUserId, token, setToken, userId } = useStore();

  useEffect(() => {
    if (token?.expiresAt && token.expiresAt < new Date()) {
      setToken(undefined);
      setUserId(undefined);
    }
  }, [setToken, setUserId, token]);

  useEffect(() => {
    if (isConnected && connection) {
      connection.on("SendFriendRequest", (id: number, friendId: number) => {
        queryClient.setQueryData(
          ["user", { id }],
          (oldData: User | undefined) => {
            if (!oldData) {
              return;
            }

            return {
              ...oldData,
              friendRequests: [...oldData.friendRequests, friendId],
            };
          }
        );
      });

      connection.on("FeedUpdated", (id: number, message: Message) => {
        queryClient.setQueryData(["feed"], (oldData: Message[] | undefined) => {
          if (!oldData) {
            return;
          }

          return [...oldData, message];
        });
      });
    }
  }, [connection, isConnected, queryClient, userId]);

  if (gettingUser && userId !== undefined) {
    return <LoadingMessage title="Loading ..." />;
  }

  return (
    <Theme name={user?.userSettings?.darkMode ? "dark" : "light"}>
      <StatusBar backgroundColor={theme.backgroundAccent.val} />
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
            <Stack.Screen
              name="Create"
              component={CreateWorkout}
              initialParams={{ workout: undefined }}
            />
            <Stack.Screen
              name="Activity"
              component={ActivityDetails}
              initialParams={{ mainActivityId: 0 }}
            />
            <Stack.Screen name="Notifications" component={Notifications} />
          </Stack.Group>
        )}

        {user === undefined && (
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

// todo: fix asset loader

/*   const [assetProgress, setAssetProgress] = React.useState({
    current: -1,
    total: 0,
  }); */

/*   if (assetProgress.current < assetProgress.total) {
    return (
      <AssetLoader progress={assetProgress} setProgress={setAssetProgress} />
    );
  } */
