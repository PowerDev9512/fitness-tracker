import Constants from "expo-constants";
import React from "react";
import { Heading, XStack } from "tamagui";

import NotificationBell from "./notificationBell";
import { SideBarButton } from "./sideBarButton";

interface Props {
  name: string;
}

const DrawerHeaderInternal = ({ name }: Props) => {
  const STATUSBAR_HEIGHT = Constants.statusBarHeight;

  return (
    <XStack
      mt={STATUSBAR_HEIGHT}
      backgroundColor="$backgroundAccent"
      py="$3"
      justifyContent="space-between"
      alignItems="center"
    >
      <XStack alignItems="center">
        <SideBarButton />
        <Heading>{name}</Heading>
      </XStack>
      <NotificationBell />
    </XStack>
  );
};

export const SideBarHeader = React.memo(DrawerHeaderInternal);
