import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useQueryClient } from "@tanstack/react-query";
import { useGetUser } from "api";
import { Avatar } from "components";
import React, { useCallback } from "react";
import { useStore } from "store";
import { Text, useTheme, XStack, YStack } from "tamagui";

type Props = DrawerContentComponentProps & {
  onPremiumPress: () => void;
};

export const SideBar = ({
  state,
  navigation,
  descriptors,
  onPremiumPress,
}: Props) => {
  const { setUserId, setToken } = useStore();
  const { data: user } = useGetUser();
  const queryClient = useQueryClient();

  const theme = useTheme();
  const userName = !user ? "Guest" : `${user.username}`;
  const title = user?.title?.name;

  const headerIcon = useCallback(() => {
    const text = title ? (
      <YStack>
        <Text fontSize={20}>{userName}</Text>
        <Text fontSize={14}>{title}</Text>
      </YStack>
    ) : (
      <Text my="auto" fontSize={20}>
        {userName}
      </Text>
    );

    return (
      <XStack alignItems="center" width="100%">
        <Avatar mr="$2" size="md" callback={() => null} user={user ?? null} />
        {text}
      </XStack>
    );
  }, [title, user, userName]);

  return (
    <DrawerContentScrollView
      style={{ backgroundColor: theme.background.val }}
      fadingEdgeLength={10}
    >
      <DrawerItem
        label=""
        onPress={() => null}
        icon={headerIcon}
        pressOpacity={0}
      />

      <DrawerItemList
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />

      <DrawerItem label="Premium" onPress={() => onPremiumPress()} />

      <DrawerItem
        label="Logout"
        onPress={() => {
          queryClient.clear();
          setToken(undefined);
          setUserId(undefined);
        }}
      />
    </DrawerContentScrollView>
  );
};
