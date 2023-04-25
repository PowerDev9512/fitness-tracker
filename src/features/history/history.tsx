import { useGetUser } from "api";
import { Carousel, Screen, WorkoutCard } from "components";
import React, { useMemo } from "react";
import { Stack, Text } from "tamagui";
import { CompletedWorkout } from "types";
import { getPastWorkouts } from "utils";

export const History = () => {
  const { data: user } = useGetUser();

  const pastWorkouts = useMemo(() => getPastWorkouts(user), [user]);

  const renderItem = (
    item: CompletedWorkout,
    index: number,
    isFocused: boolean
  ) => (
    <Stack margin="auto">
      <WorkoutCard
        workout={item}
        key={index}
        footer={null}
        isFocused={isFocused}
      />
    </Stack>
  );

  if (pastWorkouts.length === 0) {
    return (
      <Screen>
        <Text fontSize={16} mt={10}>
          {" "}
          No past workouts exist{" "}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Carousel
        renderItem={renderItem}
        items={pastWorkouts}
        defaultIndex={pastWorkouts.length - 1}
      />
    </Screen>
  );
};
