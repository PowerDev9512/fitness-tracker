import { Avatar, Skeleton } from "components";
import React, { useMemo } from "react";
import { Pressable } from "react-native";
import { Card, Heading, Text, XStack, YStack } from "tamagui";
import { Message, User } from "types";

interface Props {
  message: Message;
  onPress: (user: User) => void;
}

export const FeedEntry = ({ message: item, onPress }: Props) => {
  const timeSinceMessage = Math.abs(
    (new Date().getTime() - new Date(item.date).getTime()) / 1000
  );

  const formattedTimeSince = useMemo(() => {
    if (timeSinceMessage < 60) {
      return `${timeSinceMessage} seconds ago`;
    } else if (timeSinceMessage < 3600) {
      return `${Math.floor(timeSinceMessage / 60)} minutes ago`;
    } else if (timeSinceMessage < 86400) {
      return `${Math.floor(timeSinceMessage / 3600)} hours ago`;
    } else {
      return `${Math.floor(timeSinceMessage / 86400)} days ago`;
    }
  }, [timeSinceMessage]);

  if (!item?.user?.username) {
    return <Skeleton />;
  }

  return (
    <Pressable onPress={() => onPress(item.user)}>
      <Card bg="$primary300">
        <Card w="100%" bg="white">
          <XStack>
            <Avatar p="$3" callback={() => null} user={item.user} size="md" />
            <YStack>
              <Heading mt="$3"> {item.user.username} </Heading>
              <Text mt="$-1"> {formattedTimeSince} </Text>
            </YStack>
          </XStack>
          <Text ml="$-5"> {item.text} </Text>
        </Card>
        <Text textAlign="right" p="$1.5">
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </Card>
    </Pressable>
  );
};
