import { useSendFriendRequest } from "api";
import { Avatar, Button, Loading, MainCard, Modal } from "components";
import React, { useEffect } from "react";
import { Card, Heading, Stack, Text, XStack, YStack } from "tamagui";
import { User } from "types";

interface Props {
  user: User | null;
  friend: User | null;
  loading: boolean;
  onClose: () => void;
}

export const AddFriendModal = ({ friend, user, loading, onClose }: Props) => {
  const {
    mutate: addFriend,
    isLoading: adding,
    status: addingStatus,
  } = useSendFriendRequest();

  useEffect(() => {
    if (addingStatus === "success") {
      onClose();
    }
  }, [addingStatus, onClose]);

  if (!user || !friend) {
    return null;
  }

  const isFriend = user.friends?.includes(user.id);

  return (
    <Modal isOpen={!!friend} onClose={onClose}>
      {loading && <Loading message="Loading user" />}
      {!loading && (
        <MainCard alignItems="center">
          <YStack mb="$4" alignItems="center">
            <Heading> {friend.username} </Heading>
            <Text>Level {friend.workoutBuddy.data.levelStats.overall} </Text>
            <Text> {friend.title?.name ?? ""} </Text>
          </YStack>

          <Avatar callback={() => null} user={friend} size="xl" />

          <XStack ml="auto" mt="$4">
            <Button variant="link" onPress={onClose}>Close</Button>

            {!isFriend && (
              <Button
                disabled={adding}
                onPress={() => {
                  addFriend({ friendId: user.id });
                }}
              >
                Add Friend
              </Button>
            )}

            {isFriend && (
              <Button disabled={adding} onPress={() => null}>
                Remove Friend
              </Button>
            )}
          </XStack>
        </MainCard>
      )}
    </Modal>
  );
};
