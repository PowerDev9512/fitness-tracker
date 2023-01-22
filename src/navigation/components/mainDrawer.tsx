import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useGetUser } from "api";
import { Avatar } from "components";
import React, { useCallback } from "react";
import { useStore } from "store";
import { Text, XStack, YStack } from "tamagui";

export const MainDrawer = ({
  state,
  navigation,
  descriptors,
}: DrawerContentComponentProps) => {
  const { setUserId } = useStore();
  const { data: user } = useGetUser();

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
  }, []);

  return (
    <DrawerContentScrollView>
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

      <DrawerItem label="Logout" onPress={() => setUserId(-1)} />
    </DrawerContentScrollView>
  );
};
