import { useNavigation } from "@react-navigation/native";
import { useEditWorkout, useGetUser } from "api";
import { Button, Carousel, Screen } from "components";
import React from "react";
import { Text, useTheme, View } from "tamagui";
import { ScheduledWorkout } from "types";
import { getScheduledWorkouts } from "utils";

import { ScheduledWorkoutCard } from "./components/scheduledWorkoutCard/scheduledWorkoutCard";

export function Schedule() {
  const { isLoading: editLoading, mutate: editWorkout } = useEditWorkout();
  const naviagtion = useNavigation();
  const theme = useTheme();
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

  const content =
    scheduledWorkouts.length > 0 ? (
      <Carousel renderItem={renderItem} items={scheduledWorkouts} />
    ) : (
      <Text fontSize="md" mt={10}>
        No workouts scheduled
      </Text>
    );

  return (
    <Screen loading={editLoading}>
      {content}
      <Button
        position="absolute"
        bottom={85}
        right={5}
        rounded="full"
        width={60}
        height={60}
        onPress={() => naviagtion.navigate("Create" as never)}
      >
        <Text textAlign="center" fontSize={40} color="white">
          {"\n"}+
        </Text>
      </Button>
    </Screen>
  );
}
