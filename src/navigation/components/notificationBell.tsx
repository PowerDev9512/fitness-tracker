import { useNavigation } from "@react-navigation/native";
import { useGetUser } from "api";
import React from "react";
import { Button, Stack, Text } from "tamagui";

export default function NotificationBell() {
  const { data: user } = useGetUser();
  const navigation = useNavigation();

  return (
    <>
      <Button
        onPress={() => navigation.navigate("Notifications" as never)}
        icon={<NotificationBell />}
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
          <Text pb={1} textAlign="center" color="white" fontSize="xs">
            {user?.friendRequests.length}
          </Text>
        </Stack>
      )}
    </>
  );
}
