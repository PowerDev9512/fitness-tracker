import { useNavigation } from "@react-navigation/native";
import { Bell } from "@tamagui/lucide-icons";
import { useGetUser } from "api";
import { IconButton } from "components";
import React from "react";
import { Stack, Text } from "tamagui";

export default () => {
  const { data: user } = useGetUser();
  const navigation = useNavigation();

  return (
    <>
      <IconButton
        onPress={() => navigation.navigate("Notifications" as never)}
        icon={Bell}
      />
      {(user?.friendRequests ?? 0) > 0 && (
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
    </>
  );
}
