import { useSendFriendRequest } from "api";
import { Avatar, Button, Card, Heading, Modal, Skeleton } from "components";
import React, { useEffect } from "react";
import { Text, XStack, YStack } from "tamagui";
import { OtherUser, User } from "types";

interface Props {
  user: User | null;
  friend: OtherUser | null;
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

  const isFriend = user?.friends?.includes(friend?.id ?? -1) ?? false;

  return (
    <Modal isOpen={friend !== null} onClose={onClose}>
      <Card p="$4" alignItems="center">
        <YStack mb="$4" alignItems="center">
          {loading && <Skeleton />}
          {!loading && friend && (
            <>
              <Heading> {friend.username} </Heading>
              <Text>Level {friend.level} </Text>
              <Text> {friend.title?.name ?? ""} </Text>
            </>
          )}
        </YStack>

        <Avatar callback={() => null} user={friend} size="xl" />

        <XStack ml="auto" mt="$4">
          <Button
            accessibilityLabel="Close modal"
            variant="link"
            onPress={onClose}
          >
            Close
          </Button>

          {!isFriend && (
            <Button
              accessibilityLabel="Add friend"
              isLoading={adding || loading}
              onPress={() => {
                addFriend({ friendId: friend?.id ?? -1 });
              }}
            >
              Add Friend
            </Button>
          )}

          {isFriend && (
            <Button
              accessibilityLabel="Remove friend"
              isLoading={adding}
              onPress={() => null}
            >
              Remove Friend
            </Button>
          )}
        </XStack>
      </Card>
    </Modal>
  );
};
