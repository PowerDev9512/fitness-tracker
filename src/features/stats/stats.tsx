import { useGetUser } from "api";
import { Screen } from "components";
import React from "react";
import { Heading, Text } from "tamagui";

import { BuddyStats } from "./components/buddyStats/buddyStats";
import { WorkoutChart } from "./components/workoutChart/workoutChart";

export function Stats() {
  const { data: user } = useGetUser();

  const streakText =
    (user?.workoutBuddy?.data?.streak ?? 0) > 0
      ? `\nYou're on a roll, keep up the ${user?.workoutBuddy.data.streak} day streak!`
      : null;

  return (
    <Screen loading={!user}>
      <Heading marginTop="5"> Welcome back, {user?.username} </Heading>

      <Text fontSize="md" fontWeight="semibold" textAlign="center" mb={4}>
        Its time to get your workout on
        {streakText}
      </Text>

      <BuddyStats />
      <WorkoutChart />
    </Screen>
  );
}
