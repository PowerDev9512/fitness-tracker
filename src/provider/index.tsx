import { NavigationContainer } from "@react-navigation/native";
import React, { Suspense } from "react";
import { withIAPContext } from "react-native-iap";
import { TamaguiProvider } from "tamagui";

import APIProvider from "../api/apiProvider";
import config from "../tamagui.config";

interface Props {
  children: React.ReactNode;
}

const BaseProvider = ({ children }: Props) => {
  return (
    <TamaguiProvider config={config}>
      <Suspense>
        <APIProvider>
          <NavigationContainer>{children}</NavigationContainer>
        </APIProvider>
      </Suspense>
    </TamaguiProvider>
  );
};

export const Provider = withIAPContext(BaseProvider);
