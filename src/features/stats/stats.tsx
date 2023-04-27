import { useGetUser } from "api";
import { Avatar, Button, Heading, Screen } from "components";
import React, { useMemo } from "react";
import {
  Separator,
  Text,
  ToggleGroup,
  Group,
  XStack,
  YStack,
  useTheme,
  Stack,
} from "tamagui";

import { BuddyStats } from "./buddyStats";
import { WorkoutChart } from "./workoutChart";

export const Stats = () => {
  const [index, setIndex] = React.useState(0);
  const { data: user } = useGetUser();
  const time = new Date().getHours();

  const greeting = useMemo(() => {
    if (time >= 5 && time < 12) {
      return "Good morning";
    } else if (time >= 12 && time < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  }, [time]);

  if (!user) {
    return (
      <Screen scrollable extraSpace>
        <Heading style={{ marginTop: 10, marginBottom: 10 }}>
          Loading...
        </Heading>
      </Screen>
    );
  }

  return (
    <Screen scrollable extraSpace>
      <XStack mr="auto" flex={1} w="100%" h={75}>
        <YStack my="auto" ml="$1" mr="auto">
          <Heading fontWeight="normal">{greeting}</Heading>
          <Heading fontWeight="bold">{user.username}!</Heading>
        </YStack>
        <Avatar
          mr="$2"
          ml="auto"
          my="auto"
          user={user}
          size="ms"
          callback={() => {}}
        />
      </XStack>

      <Group
        orientation="horizontal"
        backgroundColor="$white"
        h="$0.5"
        w="100%"
      >
        <Group.Item>
          <Button
            accessibilityLabel="Stats"
            h={30}
            w="50%"
            backgroundColor={index === 0 ? "$primary100" : "$white"}
            onPress={() => setIndex(0)}
            pressStyle={{ backgroundColor: "$primary200" }}
          >
            <Text>Stats</Text>
          </Button>
        </Group.Item>
        <Group.Item>
          <Button
            accessibilityLabel="Graph"
            h={30}
            w="50%"
            backgroundColor={index === 1 ? "$primary100" : "$white"}
            onPress={() => setIndex(1)}
            pressStyle={{ backgroundColor: "$primary200" }}
          >
            <Text>Graph</Text>
          </Button>
        </Group.Item>
      </Group>

      {index === 0 && <BuddyStats />}
      {index === 1 && <WorkoutChart />}
    </Screen>
  );
};
