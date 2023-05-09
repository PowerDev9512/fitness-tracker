import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useQueryClient } from "@tanstack/react-query";
import { useGetUser } from "api";
import { Avatar } from "components";
import { InAppPurchase } from "expo-in-app-purchases";
import React, { useCallback, useEffect, useState } from "react";
import { useStore } from "store";
import { Text, useTheme, XStack, YStack } from "tamagui";

import { useIap } from "../../utils/useIap";
import { Linking } from "react-native";

type Props = DrawerContentComponentProps & {
  onPremiumPress: () => void;
};

export const SideBar = ({
  state,
  navigation,
  descriptors,
  onPremiumPress,
}: Props) => {
  const { connected, getPurchases } = useIap();
  const [purchases, setPurchases] = useState<InAppPurchase[]>([]);

  const isSubscribed =
    purchases.length > 0 &&
    purchases.find((p) => p.productId === "premium_subscription");

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

  useEffect(() => {
    if (connected) {
      getPurchases().then((p) => setPurchases(p));
    }
  }, [connected, getPurchases]);

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

      {connected && !isSubscribed && (
        <DrawerItem label="Premium" onPress={() => onPremiumPress()} />
      )}

      {connected && isSubscribed && (
        <DrawerItem
          label="Cancel Premium"
          onPress={() =>
            Linking.openURL(
              "https://play.google.com/store/account/subscriptions?package=fitness.tracker&sku=premium_subscription"
            )
          }
        />
      )}

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
