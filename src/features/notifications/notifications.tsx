import React, { useCallback, useEffect } from 'react';
import { Text, FlatList, Card, HStack } from 'tamagui';
import { Avatar, Button, Screen } from 'components';
import { useConfirmFriendRequest, useGetUser, useGetUsers } from 'api';
import { useRejectFriendRequest } from '../../api/social/useRejectFriendRequest';

export function Notifications({ navigation }: NavigationProps) {
  const [actionedId, setActionedId] = React.useState<number | null>(null);
  const { data: user, isLoading: userLoading } = useGetUser();
  const { data: batchedUsers } = useGetUsers(user?.friendRequests ?? []);
  const { mutate: acceptFriend, isLoading: accepting, status: addStatus } = useConfirmFriendRequest();
  const { mutate: declineFriend, isLoading: declining, status: declineStatus } = useRejectFriendRequest();

  useEffect(() => {
    if (addStatus === 'success' || declineStatus === 'success') {
      setActionedId(null);
    }
  }, [addStatus, declineStatus])
  

  const handleOnAccept = useCallback((friendId: number) => {
    setActionedId(friendId);
    acceptFriend({ friendId });
  }, [acceptFriend]);

  const handleOnDecline = useCallback((friendId: number) => {
    setActionedId(friendId);
    declineFriend({ friendId });
  }, [declineFriend]);

  return (
    <Screen loading={userLoading}>
      <FlatList
        w="100%"
        data={user?.friendRequests ?? []}
        renderItem={({ item }) => {
          const currentUser = batchedUsers?.find((u) => u.id === item) ?? null;
          if (currentUser == null) {
            return null;
          }

          return (
            <Card pt={-5} w="90%" mx="auto" mt={2}>
              </XStack>
                <Avatar user={currentUser} size="md" callback={() => null} />
                <Text mt={7} ml={2}>
                  {' '}
                  {`${currentUser?.username} has sent you a friend request!`}
                </Text>
              </XStack>
              <XStack ml="auto">
                <Button
                  isLoading={actionedId === currentUser.id && declining}
                  onPress={() => handleOnDecline(currentUser.id)}
                  variant="link"
                >
                  Decline
                </Button>
                <Button
                  isLoading={actionedId === currentUser.id && accepting}
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
}
