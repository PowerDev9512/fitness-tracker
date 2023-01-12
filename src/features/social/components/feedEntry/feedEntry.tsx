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
      <Card bg="$primary300">
        <Card bg="white">
          <Avatar callback={() => null} user={item.user} size="md" />
          <XStack>
            <YStack>
              <Heading> {item.user.username} </Heading>
              <Text> {item.text} </Text>
            </YStack>
          </XStack>
        </Card>
        <Text textAlign="right">
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </Card>
    </Pressable>
  );
};
