import { useConfirmFriendRequest, useGetUser, useGetOtherUsers } from "api";
import { Avatar, Button, Card, Screen } from "components";
import React, { useCallback, useEffect } from "react";
import { FlatList } from "react-native";
import { Text, XStack } from "tamagui";

import { useRejectFriendRequest } from "../../api/social/useRejectFriendRequest";

export const Notifications = () => {
  const [actionedId, setActionedId] = React.useState<number | null>(null);
  const { data: user, isLoading: userLoading } = useGetUser();
  const { data: batchedUsers } = useGetOtherUsers(user?.friendRequests ?? []);
  const {
    mutate: acceptFriend,
    status: addStatus,
    isLoading: accepting,
  } = useConfirmFriendRequest();
  const {
    mutate: declineFriend,
    status: declineStatus,
    isLoading: declining,
  } = useRejectFriendRequest();

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
    <Screen>
      <FlatList
        data={user?.friendRequests ?? []}
        renderItem={({ item }) => {
          const currentUser = batchedUsers?.find((u) => u.id === item) ?? null;
          if (currentUser == null) {
            return null;
          }

          return (
            <Card p="$4" w="100%" mx="auto" mt="$-1">
              <XStack>
                <Avatar user={currentUser} size="md" callback={() => null} />
                <Text mt={7} ml={2}>
                  {" "}
                  {`${currentUser?.username} has sent you a friend request!`}
                </Text>
              </XStack>
              <XStack ml="auto">
                <Button
                  accessibilityLabel="Decline friend request"
                  variant="link"
                  isLoading={accepting}
                  onPress={() => handleOnDecline(currentUser.id)}
                >
                  Decline
                </Button>
                <Button
                  accessibilityLabel="Accept friend request"
                  isLoading={declining}
                  onPress={() => handleOnAccept(currentUser.id)}
                >
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
