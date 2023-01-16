import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useGetUser } from "api";
import { Screen } from "components";
import React from "react";
import { Heading, Text } from "tamagui";

import { BuddyStats } from "./components/buddyStats/buddyStats";
import { WorkoutChart } from "./components/workoutChart/workoutChart";

export const Stats = () => {
  const [index, setIndex] = React.useState(0);
  const { data: user } = useGetUser();

  const streakText =
    (user?.workoutBuddy?.data?.streak ?? 0) > 0
      ? `\nYou're on a roll, keep up the ${user?.workoutBuddy.data.streak} day streak!`
      : null;

  return (
    <Screen loading={!user}>
      <Heading mb="$-3" size="$9">
        Hello, {user?.username}
      </Heading>

      <Text fontSize={16} fontWeight="semibold" textAlign="center">
        Its time to get your workout on!
        {streakText}
      </Text>

      <SegmentedControl
        style={{ width: "90%", marginBottom: -10, height: 30 }}
        values={["Stats", "Graphs"]}
        selectedIndex={index}
        onChange={(event) => {
          setIndex(event.nativeEvent.selectedSegmentIndex);
        }}
        tabStyle={{
          borderColor: "transparent",
          backgroundColor: "transparent",
          height: 30,
        }}
      />

      {index === 0 && <BuddyStats />}
      {index === 1 && <WorkoutChart />}
    </Screen>
  );
};
