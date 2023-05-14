import { useNavigation } from "@react-navigation/native";
import { useGetUser } from "api";
import { IconButton } from "components";
import React from "react";
import { Circle, Stack } from "tamagui";

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
        <Circle
          position="absolute"
          top={2}
          right={2}
          size={10}
          bg="$primary500"
        />
      )}
    </Stack>
  );
};
