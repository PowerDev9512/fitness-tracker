import "expo-dev-client";

import { useFonts } from "expo-font";

import { NativeNavigation } from "./navigation";
import { Provider } from "./provider";

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
      <NativeNavigation />
    </Provider>
  );
};

export default App;
