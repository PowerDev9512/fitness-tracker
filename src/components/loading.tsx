import React from "react";
import { Heading, Spinner, Stack, YStack } from "tamagui";

interface Props {
  message?: string;
}

export const Loading = ({ message }: Props) => {
  return (
    <Stack backgroundColor="$backgroundStrong" h="100%">
      <YStack ml={-1} mt={230} space={2} justifyContent="center">
        <Spinner accessibilityLabel="Loading page" />
        <Heading ml={3} textAlign="center" color="$primary500" fontSize="xl">
          {message ?? "Loading..."}
        </Heading>
      </YStack>
    </Stack>
  );
};
