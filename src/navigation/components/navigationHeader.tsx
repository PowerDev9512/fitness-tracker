import React from "react";
import { Heading, Stack, useTheme, XStack } from "tamagui";

import { DrawerButton } from "./drawerButton";
import NotificationBell from "./notificationBell";

type BaseProps = {
  loggedIn: boolean;
};

type Props = BaseProps;

const NavigationHeaderInternal = ({ loggedIn }: Props) => {
  const theme = useTheme();

  return (
    <Stack
      py="$2"
      alignItems="center"
      justifyContent="center"
      backgroundColor={theme.backgroundAccent.val}
    >
      <XStack
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        mr="auto"
      >
        {loggedIn && <DrawerButton />}
        <Heading>Dashboard</Heading>
        {loggedIn && <NotificationBell />}
      </XStack>
    </Stack>
  );
};

export const NavigationHeader = React.memo(NavigationHeaderInternal);
