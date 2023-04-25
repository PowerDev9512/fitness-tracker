import { useGetUser } from "api";
import { Avatar, Button, Heading, Screen } from "components";
import React from "react";
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
  const theme = useTheme();

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
      <XStack>
        <Avatar user={user} size="lg" callback={() => {}} />
        <YStack my="auto" ml="$10">
          <Heading>{user.username}</Heading>
          <Text>{user?.title?.name ?? "No Title Set"}</Text>
          <Separator my="$2" w="100%" borderColor="$gray500" />
          <Text>Level {user.workoutBuddy.data.levelStats.overall}</Text>
          <Text>{user.workoutBuddy.data.streak} day streak</Text>
        </YStack>
      </XStack>

      <Group orientation="horizontal" backgroundColor="$white" h="$2" w="100%">
        <Group.Item>
          <Button
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
