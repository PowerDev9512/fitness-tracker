import "expo-dev-client";

import { useFonts } from "expo-font";
import React from "react";
import { LogBox } from "react-native";
import Toast from "react-native-toast-message";

import { MainStack } from "./navigation/main/mainStack";
import { Provider } from "./provider";
import { toastConfig } from "./toast.config";

LogBox.ignoreLogs(["Require cycle: node_modules/victory"]);
LogBox.ignoreLogs(["warning: matchMedia implementation is not provided."]);
LogBox.ignoreLogs(["Please report: Excessive number of pending callbacks: 501."]);
LogBox.ignoreLogs(["VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead."]);

const App = () => {
  const [appIsReady] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  if (!appIsReady) {
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
