import "expo-dev-client";

import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { LogBox } from "react-native";
import Toast from "react-native-toast-message";

import { MainStack } from "./navigation/main/mainStack";
import { Provider } from "./provider";
import { toastConfig } from "./toast.config";
import { useStore } from "store";
import { client } from "api";

LogBox.ignoreLogs(["Require cycle: node_modules/victory"]);
LogBox.ignoreLogs(["warning: matchMedia implementation is not provided."]);
LogBox.ignoreLogs(["Please report: Excessive number of pending callbacks: 501."]);
LogBox.ignoreLogs(["VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead."]);

type MeResponse = {
  value: {
    token: string;
  };
};

const refreshInterval = 3600000; // 1 hour in milliseconds

const refreshToken = async (setToken: (token: string) => void) => {
  try {
    const response = await client.get<MeResponse>("/users/me");
    setToken(response.data.value.token);
  } catch (error) {
    console.log(error);
  }
};

const startTokenRefresh = (token: string, setToken: (token: string) => void) => {
  setTimeout(async () => {
    await refreshToken(setToken);
    startTokenRefresh(token, setToken);
  }, refreshInterval);
};

const App = () => {
  const { userId, token, setToken } = useStore();
  
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (!token) return;
    startTokenRefresh(token, setToken);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <Provider>
      <MainStack />
      <Toast config={toastConfig} />
    </Provider>
  );
};

export default App;
