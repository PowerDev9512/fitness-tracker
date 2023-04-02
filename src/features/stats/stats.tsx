import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useGetUser } from "api";
import { Avatar, Heading, Screen } from "components";
import React from "react";
import { Separator, Text, XStack, YStack, useTheme } from "tamagui";

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
          <Text>{user?.title?.name ?? "Titleless"}</Text>
          <Separator my="$2" w="100%" borderColor="$gray500" />
          <Text>Level {user.workoutBuddy.data.levelStats.overall}</Text>
          <Text>{user.workoutBuddy.data.streak} day streak</Text>
        </YStack>
      </XStack>

      <SegmentedControl
        style={{
          width: "100%",
          marginBottom: -25,
          height: 30,
        }}
        tintColor={theme.backgroundStrong.val}
        fontStyle={{
          color: theme.black.val,
        }}
        tabStyle={{
          backgroundColor: theme.white.val,
          borderRadius: 0,
        }}
        values={["Stats", "Graphs"]}
        selectedIndex={index}
        onChange={(event) => {
          setIndex(event.nativeEvent.selectedSegmentIndex);
        }}
        backgroundColor={theme.white.val}
      />

      {index === 0 && <BuddyStats />}
      {index === 1 && <WorkoutChart />}
    </Screen>
  );
};
