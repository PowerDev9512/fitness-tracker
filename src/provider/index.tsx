import { NavigationContainer } from "@react-navigation/native";
import React, { Suspense } from "react";
import { TamaguiProvider } from "tamagui";

import APIProvider from "../api/apiProvider";
import config from "../tamagui.config";

interface Props {
  children: React.ReactNode;
}

export const Provider = ({ children }: Props) => {
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
