import { useNavigation } from "@react-navigation/native";
import { useGetUser } from "api";
import { IconButton } from "components";
import React from "react";
import { Stack, Text } from "tamagui";

export default () => {
  const { data: user } = useGetUser();
  const navigation = useNavigation();
  const friendRequests = user?.friendRequests?.length ?? 0;

  return (
    <Stack mr="$5">
      <IconButton
        onPress={() => navigation.navigate("Notifications" as never)}
        icon="notifications-outline"
        size={28}
        color="$gray700"
      />
      {friendRequests > 0 && (
        <Text
          textAlign="center"
          color="$primary300"
          fontSize={18}
          position="absolute"
          top={2}
          right={-10}
        >
          {user?.friendRequests.length}
        </Text>
      )}
    </Stack>
  );
};
