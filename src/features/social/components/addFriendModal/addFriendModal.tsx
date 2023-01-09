import { useSendFriendRequest } from "api";
import { Avatar, Button, Loading } from "components";
import React, { useEffect } from "react";
import { Card, Heading, HStack, Modal, Text, VStack } from "tamagui";
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
              <Heading size="md"> {friend.username} </Heading>
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
              <Button variant="link" style={{ margin: -10 }} onPress={onClose}>
                Close
              </Button>

              {!isFriend && (
                <Button
                  isLoading={adding}
                  disabled={adding}
                  onPress={() => {
                    addFriend({ friendId: user.id });
                  }}
                >
                  Add Friend
                </Button>
              )}

              {isFriend && (
                <Button
                  isLoading={adding}
                  disabled={adding}
                  onPress={() => null}
                >
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
