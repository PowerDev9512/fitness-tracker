import { useNavigation } from "@react-navigation/native";
import { Plus, PlusCircle } from "@tamagui/lucide-icons";
import { useEditWorkout, useGetUser } from "api";
import { Carousel, IconButton, Screen } from "components";
import React from "react";
import { Circle, Stack, Text } from "tamagui";
import { ScheduledWorkout } from "types";
import { getScheduledWorkouts } from "utils";

import { ScheduledWorkoutCard } from "./components/scheduledWorkoutCard/scheduledWorkoutCard";

export const Schedule = () => {
  const { isLoading: editLoading, mutate: editWorkout } = useEditWorkout();
  const naviagtion = useNavigation();
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
      <Text fontSize={16} mt={10}>
        No workouts scheduled
      </Text>
    );

  return (
    <Screen>
      {content}
      <IconButton
        position="absolute"
        bottom={92}
        right={10}
        size={64}
        color="$primary500"
        icon="add-circle"
        zIndex={3}
        onPress={() => naviagtion.navigate("Create" as never)}
      />
    </Screen>
  );
};
