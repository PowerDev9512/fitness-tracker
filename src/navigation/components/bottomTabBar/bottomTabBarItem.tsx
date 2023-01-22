import { RouteConfig } from "@react-navigation/native";
import React from "react";
import { Stack, Text } from "tamagui";

type MenuItem = {
  position: "LEFT" | "RIGHT" | "CENTER";
};

type RouteConfigComponent = RouteConfig<any, any, any, any, any>;

type Props = RouteConfigComponent & MenuItem;

export const BottomTabBarScreen = ({ name }: Props) => {
  return (
    <Stack flex={1} alignItems="center" justifyContent="center">
      <Text>{name}</Text>
    </Stack>
  );
};
