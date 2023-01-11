import { useGetFeed, useGetUser, useGetUsers } from "api";
import { Button, Input, Loading, Screen } from "components";
import React, { useCallback, useEffect, useMemo } from "react";
import { FlatList } from "react-native";
import Toast from "react-native-toast-message";
import { XStack } from "tamagui";
import { Message, User } from "types";

import { AddFriendModal } from "./components/addFriendModal/addFriendModal";
import { FeedEntry } from "./components/feedEntry/feedEntry";
import { FeedHeader } from "./components/feedHeader/feedHeader";

export const Social = () => {
  const [searchedUserId, setSearchedUserId] = React.useState<number>(-1);
  const [searchedUser, setSearchedUser] = React.useState<User | null>(null);
  const [search, setSearch] = React.useState("");

  const { data: users } = useGetUsers();
  const { data: user } = useGetUser();
  const { data: friend, isLoading: friendLoading } = useGetUser(searchedUserId);
  const { data: feed, isLoading: feedLoading } = useGetFeed();

  const searchableUsers = (users ?? []).filter((item) => item.id !== user?.id);

  const createHeader = useMemo(() => <FeedHeader name="Feed" />, []);
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

      <XStack mt={5} alignItems="center" space={4}>
        <Input
          w="65%"
          placeholder="Search for friends"
          mx="auto"
          value={search}
          onChangeText={setSearch}
          type="text"
        />
        <Button
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
                type: "warning",
              });
            }
          }}
        >
          Search
        </Button>
      </XStack>

      {feedLoading && <Loading message="Loading social feed" />}
      {!feedLoading && (
        <FlatList
          style={{ width: "90%" }}
          data={feed ?? []}
          keyExtractor={(item) => item.text + item.user.id + item.date}
          ListHeaderComponent={createHeader}
          renderItem={({ item }) => createMessage(item)}
        />
      )}
    </Screen>
  );
};
