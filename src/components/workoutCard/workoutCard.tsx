import { useDeleteWorkout, useGetUser } from "api";
import dateFormat from "dateformat";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { Separator, Stack, Text, useTheme, YStack } from "tamagui";
import { Workout } from "types";
import { titleCase } from "utils";

import { WorkoutCardBadges } from "./components/workoutCardBadges";
import { WorkoutCardContent } from "./components/workoutCardContent";
import { WorkoutCardFooter } from "./components/workoutCardFooter";
import { Badge } from "../badge";
import { Card } from "../card";
import { Heading } from "../heading";

interface Props {
  workout: Workout;
  footer: React.ReactNode | null;
}

export const WorkoutCard = ({ workout, footer }: Props) => {
  const theme = useTheme();

  const { data: user } = useGetUser();
  const { mutate: deleteWorkout, isLoading: deleting } = useDeleteWorkout();

  return (
    <Stack h="100%">
      <YStack h="100%">
        <Badge
          side="left"
          loading={deleting}
          onClick={() => {
            deleteWorkout({ userId: user?.id ?? -1, workoutId: workout.id });
          }}
        >
          <Icon name="trash-bin-sharp" size={25} color={theme.red.val} />
        </Badge>

        <WorkoutCardBadges workout={workout} />

        <Card p="$4" accessibilityLabel="workout-card" w={350} minHeight={410}>
          <Heading textAlign="center" justifyContent="center" mt="$1">
            {titleCase(workout.name)}
          </Heading>

          <Text justifyContent="center" textAlign="center" mb="$1">
            {dateFormat(new Date(workout.time), "dddd, mmmm dS")}
          </Text>

          <Separator mt="$4" mb="$3" />

          <WorkoutCardContent workout={workout} />

          <WorkoutCardFooter content={footer} />
        </Card>
      </YStack>
    </Stack>
  );
};
