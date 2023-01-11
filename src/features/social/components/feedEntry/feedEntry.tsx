import { Avatar, Skeleton } from "components";
import React from "react";
import { Pressable } from "react-native";
import { Card, Heading, Text, XStack, YStack } from "tamagui";
import { Message, User } from "types";

interface Props {
  message: Message;
  onPress: (user: User) => void;
}

export const FeedEntry = ({ message: item, onPress }: Props) => {
  if (!item?.user?.username) {
    return <Skeleton />;
  }

  return (
    <Pressable onPress={() => onPress(item.user)}>
      <Card mb={5} bg="$primary300">
        <Card mx={-4} mt={-4} bg="$white">
          <Avatar callback={() => null} user={item.user} size="md" />
          <XStack ml={15} mt={-12} space={2} mb={-5}>
            <YStack>
              <Heading ml="9"> {item.user.username} </Heading>
              <Text> {item.text} </Text>
            </YStack>
          </XStack>
        </Card>
        <Text mt={1} mb={-2} textAlign="right">
          {" "}
          {new Date(item.date).toLocaleDateString()}{" "}
        </Text>
      </Card>
    </Pressable>
  );
};
