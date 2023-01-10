import { useSendFriendRequest } from "api";
import { Avatar, Loading, Modal } from "components";
import React, { useEffect } from "react";
import { Button, Card, Heading, Text, XStack, YStack } from "tamagui";
import { User } from "types";

interface Props {
  user: User | null;
  friend: User | null;
  loading: boolean;
  onClose: () => void;
}

export function AddFriendModal({ friend, user, loading, onClose }: Props) {
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
    <Modal isOpen={!!friend} onClose={() => null}>
      <Modal.CloseButton />
      {loading && <Loading message="Loading user" />}
      {!loading && (
        <Modal.Content>
          <Modal.Header>
            <YStack alignItems="center">
              <Heading> {friend.username} </Heading>
              <Text>Level {friend.workoutBuddy.data.levelStats.overall} </Text>
              <Text> {friend.title?.name ?? ""} </Text>
            </YStack>
          </Modal.Header>
          <Modal.Body>
            <Card alignItems="center">
              <Avatar callback={() => null} user={friend} size="xl" />
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <XStack space={2}>
              <Button m={-10} onPress={onClose}>
                Close
              </Button>

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
          </Modal.Footer>
        </Modal.Content>
      )}
    </Modal>
  );
}
