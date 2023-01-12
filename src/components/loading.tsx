import React from "react";
import { Spinner, Stack, Text, XStack } from "tamagui";

interface Props {
  message?: string;
}

export const Loading = ({ message }: Props) => {
  return (
    <Stack backgroundColor="$backgroundStrong" h="100%">
      <XStack ml={-1} mt={230} space={2} justifyContent="center">
        <Spinner
          size="large"
          accessibilityLabel="Loading page"
          color="$primary500"
        />
        <Text ml={3} textAlign="center" color="$primary500" fontSize={24}>
          {message ?? "Loading..."}
        </Text>
      </XStack>
    </Stack>
  );
};
