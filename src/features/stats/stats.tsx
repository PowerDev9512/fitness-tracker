import { useGetUser } from "api";
import { Avatar, Button, Heading, Screen } from "components";
import React, { useMemo } from "react";
import { useStore } from "store";
import { Text, Group, XStack, YStack } from "tamagui";
import { getUnreadMessages } from "utils";

import { BuddyStats } from "./buddyStats";
import { Messages } from "./messages";
import { WorkoutChart } from "./workoutChart";

export const Stats = () => {
  const [index, setIndex] = React.useState(0);
  const { data: user } = useGetUser();
  const { viewedScreens } = useStore();
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

  const unreadMessages = useMemo(() => {
    return getUnreadMessages(viewedScreens);
  }, [viewedScreens]);

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
            w="33%"
            px="$3"
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
            w="33%"
            px="$3"
            backgroundColor={index === 1 ? "$primary100" : "$white"}
            onPress={() => setIndex(1)}
            pressStyle={{ backgroundColor: "$primary200" }}
          >
            <Text>Graph</Text>
          </Button>
        </Group.Item>
        <Group.Item>
          <Button
            accessibilityLabel="Messages"
            h={30}
            w="34%"
            px="$3"
            backgroundColor={index === 2 ? "$primary100" : "$white"}
            onPress={() => setIndex(2)}
            pressStyle={{ backgroundColor: "$primary200" }}
          >
            <Text>Messages {unreadMessages > 0 && `(${unreadMessages})`}</Text>
          </Button>
        </Group.Item>
      </Group>

      {index === 0 && <BuddyStats />}
      {index === 1 && <WorkoutChart />}
      {index === 2 && <Messages />}
    </Screen>
  );
};
