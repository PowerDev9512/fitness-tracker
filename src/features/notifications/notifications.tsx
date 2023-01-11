import { useConfirmFriendRequest, useGetUser, useGetUsers } from "api";
import { Avatar, Button, Screen } from "components";
import React, { useCallback, useEffect } from "react";
import { FlatList } from "react-native";
import { Card, Text, XStack } from "tamagui";

import { useRejectFriendRequest } from "../../api/social/useRejectFriendRequest";

export const Notifications = () => {
  const [actionedId, setActionedId] = React.useState<number | null>(null);
  const { data: user, isLoading: userLoading } = useGetUser();
  const { data: batchedUsers } = useGetUsers(user?.friendRequests ?? []);
  const { mutate: acceptFriend, status: addStatus } = useConfirmFriendRequest();
  const { mutate: declineFriend, status: declineStatus } =
    useRejectFriendRequest();

  useEffect(() => {
    if (addStatus === "success" || declineStatus === "success") {
      setActionedId(null);
    }
  }, [addStatus, declineStatus]);

  const handleOnAccept = useCallback(
    (friendId: number) => {
      setActionedId(friendId);
      acceptFriend({ friendId });
    },
    [acceptFriend]
  );

  const handleOnDecline = useCallback(
    (friendId: number) => {
      setActionedId(friendId);
      declineFriend({ friendId });
    },
    [declineFriend]
  );

  return (
    <Screen loading={userLoading}>
      <FlatList
        data={user?.friendRequests ?? []}
        renderItem={({ item }) => {
          const currentUser = batchedUsers?.find((u) => u.id === item) ?? null;
          if (currentUser == null) {
            return null;
          }

          return (
            <Card pt={-5} w="$18" mx="auto" mt={2}>
              <XStack>
                <Avatar user={currentUser} size="md" callback={() => null} />
                <Text mt={7} ml={2}>
                  {" "}
                  {`${currentUser?.username} has sent you a friend request!`}
                </Text>
              </XStack>
              <XStack ml="auto">
                <Button onPress={() => handleOnDecline(currentUser.id)}>
                  Decline
                </Button>
                <Button onPress={() => handleOnAccept(currentUser.id)}>
                  Accept
                </Button>
              </XStack>
            </Card>
          );
        }}
      />
    </Screen>
  );
};
