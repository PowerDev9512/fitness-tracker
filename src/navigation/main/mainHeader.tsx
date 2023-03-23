import { IconButton } from "components";
import React, { useCallback } from "react";
import { Heading, XStack } from "tamagui";

import NotificationBell from "../sideBar/notificationBell";

type BaseProps = {
  loggedIn: boolean;
  name: string;
  onBackPress: () => void;
};

type Props = BaseProps;

const MainHeaderInternal = ({ loggedIn, name, onBackPress }: Props) => {
  const createNotificationBell = useCallback(() => {
    if (loggedIn && name !== "Notifications") {
      return <NotificationBell />;
    }
  }, [loggedIn, name]);

  return (
    <XStack
      backgroundColor="$backgroundAccent"
      py="$3"
      justifyContent="space-between"
      alignItems="center"
    >
      <XStack alignItems="center">
        <IconButton
          icon="md-chevron-back"
          onPress={onBackPress}
          color="$black"
          size={24}
          mr="$2"
          ml="$3"
        />
        <Heading>{name}</Heading>
      </XStack>
      {createNotificationBell()}
    </XStack>
  );
};

export const MainHeader = React.memo(MainHeaderInternal);
