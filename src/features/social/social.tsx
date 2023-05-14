import { useGetFeed, useGetOtherUsers, useGetUser } from "api";
import { Button, Input, Screen, Skeleton } from "components";
import React, { useCallback, useEffect } from "react";
import { FlatList } from "react-native";
import Toast from "react-native-toast-message";
import { XStack } from "tamagui";
import { Message, User } from "types";

import { AddFriendModal } from "./components/addFriendModal/addFriendModal";
import { FeedEntry } from "./components/feedEntry/feedEntry";

export const Social = () => {
  const [searchText, setSearchText] = React.useState("");
  const [searchedUserName, setSearchedUserName] = React.useState<string | null>("");

  const { data: user } = useGetUser();
  const { data: searchedUsers, isLoading: friendLoading } = useGetOtherUsers(
    searchedUserName ? [searchedUserName] : []
  );
  const { data: feed, isLoading: feedLoading } = useGetFeed();

  const createMessage = useCallback(
    (item: Message) => (
      <FeedEntry
        message={item}
        onPress={() => setSearchedUserName(item.user.username)}
      />
    ),
    []
  );

  useEffect(() => {
    if (searchedUserName) {
      if (searchedUsers?.length === 0) {
        Toast.show({
          type: "error",
          text1: "No user found",
        });
      }
    }
  }, [searchedUserName, searchedUsers, user?.username]);

  return (
    <>
      <AddFriendModal
        user={user as User}
        friend={searchedUsers?.[0] ?? null}
        loading={friendLoading}
        onClose={() => setSearchedUserName(null)}
      />
      <Screen>
        <XStack space="$3" w="100%">
          <Input
            w="65%"
            placeholder="Search for friends"
            value={searchText}
            onChangeText={setSearchText}
            type="text"
          />
          <Button
            accessibilityLabel="Search for friends"
            w="30%"
            onPress={() => {
              if (searchText.length > 0) {
                setSearchedUserName(searchText);
              } else {
                Toast.show({
                  type: "error",
                  text1: "Please enter a username",
                });
              }
            }}
          >
            Search
          </Button>
        </XStack>

        {feedLoading && (
          <FlatList
            style={{ width: "120%", height: "100%" }}
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            keyExtractor={(item) => item.toString()}
            renderItem={() => <Skeleton my="$2" mx="auto" h={150} />}
          />
        )}

        {!feedLoading && feed && (
          <FlatList
            style={{ width: "120%", height: "100%" }}
            data={feed ?? []}
            keyExtractor={(item) => item.workout.id.toString()}
            renderItem={({ item }) => createMessage(item)}
          />
        )}
      </Screen>
    </>
  );
};
