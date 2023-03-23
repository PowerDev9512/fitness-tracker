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
        <Stack
          position="absolute"
          top={7}
          right={1}
          bottom={0}
          width={4}
          height={4}
        >
          <Text pb={1} textAlign="center" color="white" fontSize={8}>
            {user?.friendRequests.length}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};
