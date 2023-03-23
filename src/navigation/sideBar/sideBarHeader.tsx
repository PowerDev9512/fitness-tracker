import React from "react";
import { Heading, XStack } from "tamagui";

import { SideBarButton } from "./sideBarButton";
import NotificationBell from "./notificationBell";

interface Props {
  name: string;
}

const DrawerHeaderInternal = ({ name }: Props) => {
  return (
    <XStack
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
