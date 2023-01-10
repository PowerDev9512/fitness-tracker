import React from "react";
import { Text, XStack } from "tamagui";

interface Props {
  name: string;
}

export function FeedHeader({ name }: Props) {
  return (
    <XStack pt={2} pb={2} space={2} alignItems="center">
      <Text fontSize="xl" fontWeight="bold">
        {name}
      </Text>
    </XStack>
  );
}
