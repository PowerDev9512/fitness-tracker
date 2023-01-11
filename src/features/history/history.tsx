import { useGetUser } from "api";
import { Carousel, Screen, WorkoutCard } from "components";
import React from "react";
import { Stack, Text } from "tamagui";
import { CompletedWorkout } from "types";
import { getPastWorkouts } from "utils";

export const History = () => {
  const { data: user } = useGetUser();

  const pastWorkouts = getPastWorkouts(user);

  const renderItem = (item: CompletedWorkout, index: number) => (
    <Stack margin="auto">
      <WorkoutCard workout={item} key={index} footer={null} />
    </Stack>
  );

  const content =
    pastWorkouts.length > 0 ? (
      <Carousel
        renderItem={renderItem}
        items={pastWorkouts}
        defaultIndex={pastWorkouts.length - 1}
      />
    ) : (
      <Text fontSize={16} mt={10}>
        {" "}
        No past workouts exist{" "}
      </Text>
    );

  return <Screen>{content}</Screen>;
};
