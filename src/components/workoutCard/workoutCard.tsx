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
  isFocused?: boolean;
}

export const WorkoutCard = ({ workout, footer, isFocused = true }: Props) => {
  const theme = useTheme();

  return (
    <Stack h="100%">
      <YStack h="100%">
        <WorkoutCardBadges workout={workout} />

        <Card
          p="$4"
          accessibilityLabel="workout-card"
          w={350}
          height="80%"
          backgroundColor={isFocused ? theme.white.val : theme.shadowed.val}
        >
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
