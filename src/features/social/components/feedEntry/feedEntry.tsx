import { Avatar } from "components";
import React from "react";
import {
  Card,
  Heading,
  HStack,
  Pressable,
  Skeleton,
  Text,
  useTheme,
  VStack,
} from "tamagui";
import { Message, User } from "types";

interface Props {
  message: Message;
  onPress: (user: User) => void;
}

export function FeedEntry({ message: item, onPress }: Props) {
  const theme = useTheme();
  if (!item?.user?.username) {
    return <Skeleton />;
  }

  return (
    <Pressable onPress={() => onPress(item.user)}>
      <Card mb={5} bg={theme.colors.primary[300]}>
        <Card mx={-4} mt={-4} bg={theme.colors.white} roundedBottom={0}>
          <Avatar
            ml={-2}
            mt={-6}
            callback={() => null}
            user={item.user}
            size="md"
          />
          <XStack ml={15} mt={-12} space={2} mb={-5}>
            <YStack textAlign="left">
              <Heading ml="9" size="md">
                {" "}
                {item.user.username}{" "}
              </Heading>
              <Text> {item.text} </Text>
            </YStack>
          </XStack>
        </Card>
        <Text mt={1} mb={-2} textAlign="right" italic>
          {" "}
          {new Date(item.date).toLocaleDateString()}{" "}
        </Text>
      </Card>
    </Pressable>
  );
}
