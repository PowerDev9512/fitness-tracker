import "expo-dev-client";

import { useFonts } from "expo-font";
import React from "react";
import Toast from "react-native-toast-message";

import { MainStack } from "./navigation/mainStack";
import { Provider } from "./provider";
import { toastConfig } from "./toast.config";

const App = () => {
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

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
