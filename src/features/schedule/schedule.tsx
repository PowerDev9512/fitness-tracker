import { useEditWorkout, useGetUser } from "api";
import { Carousel, Screen } from "components";
import React from "react";
import InAppReview from "react-native-in-app-review";
import { Stack, Text } from "tamagui";
import { ScheduledWorkout } from "types";
import { getScheduledWorkouts } from "utils";

import { ScheduledWorkoutCard } from "./scheduledWorkoutCard";


export const Schedule = () => {
  const { mutate: editWorkout } = useEditWorkout();
  const { data: user } = useGetUser();

  const scheduledWorkouts = getScheduledWorkouts(user);

  if (!user || scheduledWorkouts.length === 0) {
    return (
      <Screen>
        <Text fontSize={16} mt={10}>
          {" "}
          No scheduled workouts exist{" "}
        </Text>
      </Screen>
    );
  }

  const onComplete = () => (workout: ScheduledWorkout) => {
    editWorkout({
      userId: user.id,
      workout: { ...workout, completed: true, past: true },
    });

    const isAvailable = InAppReview.isAvailable();
    if (isAvailable) {
      InAppReview.RequestInAppReview();
    }
  };

  const renderItem = (item: ScheduledWorkout, index: number) => (
    <Stack margin="auto">
      <ScheduledWorkoutCard
        scheduledWorkout={item}
        onComplete={onComplete}
        key={index}
      />
    </Stack>
  );

  return (
    <Screen>
      <Carousel renderItem={renderItem} items={scheduledWorkouts} />
    </Screen>
  );
};
