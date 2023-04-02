import { useEditWorkout, useGetUser } from "api";
import { Carousel, Screen } from "components";
import React from "react";
import { Stack, Text } from "tamagui";
import { ScheduledWorkout } from "types";
import { getScheduledWorkouts } from "utils";

import { ScheduledWorkoutCard } from "./components/scheduledWorkoutCard/scheduledWorkoutCard";

export const Schedule = () => {
  const { mutate: editWorkout } = useEditWorkout();
  const { data: user } = useGetUser();

  const scheduledWorkouts = getScheduledWorkouts(user);

  if (!user) {
    return <Text>An error has occured, please sign out and try again.</Text>;
  }

  const renderItem = (item: ScheduledWorkout, index: number) => (
    <Stack margin="auto">
      <ScheduledWorkoutCard
        scheduledWorkout={item}
        onComplete={() =>
          editWorkout({
            userId: user.id,
            workout: { ...item, completed: true, past: true },
          })
        }
        key={index}
      />
    </Stack>
  );

  if (scheduledWorkouts.length === 0) {
    return (
      <Screen>
        <Text fontSize={16} mt={10}>
          {" "}
          No scheduled workouts exist{" "}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Carousel renderItem={renderItem} items={scheduledWorkouts} />
    </Screen>
  );
};
