import { useGetFeed, useGetOtherUser, useGetUser, useGetUsers } from "api";
import { Button, Input, Screen, Skeleton } from "components";
import React, { useCallback, useEffect } from "react";
import { FlatList } from "react-native";
import Toast from "react-native-toast-message";
import { XStack } from "tamagui";
import { Message, OtherUser, User } from "types";

import { AddFriendModal } from "./components/addFriendModal/addFriendModal";
import { FeedEntry } from "./components/feedEntry/feedEntry";

export const Social = () => {
  const [searchedUserId, setSearchedUserId] = React.useState<number>(-1);
  const [searchedUser, setSearchedUser] = React.useState<OtherUser | null>(null);
  const [search, setSearch] = React.useState("");

  const { data: users } = useGetUsers();
  const { data: user } = useGetUser();
  const { data: friend, isLoading: friendLoading } = useGetOtherUser(searchedUserId);
  const { data: feed, isLoading: feedLoading } = useGetFeed();

  const searchableUsers = (users ?? []).filter((item) => item.id !== user?.id);

  const createMessage = useCallback(
    (item: Message) => (
      <FeedEntry
        message={item}
        onPress={() => setSearchedUserId(item.user.id)}
      />
    ),
    []
  );

  useEffect(() => {
    if (friend) {
      setSearchedUser(friend);
      setSearchedUserId(-1);
    }
  }, [friend]);

  return (
    <Screen extraSpace>
      <AddFriendModal
        user={user as User}
        friend={searchedUser}
        loading={friendLoading}
        onClose={() => setSearchedUser(null)}
      />

      <XStack space="$3" w="100%">
        <Input
          w="65%"
          placeholder="Search for friends"
          value={search}
          onChangeText={setSearch}
          type="text"
        />
        <Button
          w="30%"
          onPress={() => {
            const foundUser = searchableUsers.find(
              (item) => item.username.toLowerCase() === search.toLowerCase()
            );

            if (foundUser) {
              setSearchedUserId(foundUser.id);
            } else {
              Toast.show({
                text1: "User not found",
                text2: "Please try a different username",
                type: "error",
              });
            }
          }}
        >
          Search
        </Button>
      </XStack>

      {feedLoading && (
        <FlatList
          style={{ width: "100%" }}
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => <Skeleton my="$2" mx="auto" h={150} />}
        />
      )}

      {!feedLoading && feed && (
        <FlatList
          style={{ width: "100%" }}
          data={feed ?? []}
          keyExtractor={(item) => item.workout.id + item.user.username + item.date}
          renderItem={({ item }) => createMessage(item)}
        />
      )}
    </Screen>
  );
};
