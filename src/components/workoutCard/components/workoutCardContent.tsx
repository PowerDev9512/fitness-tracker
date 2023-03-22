import React from "react";

import { Text, ScrollView, Stack } from "tamagui";
import { CardioRow } from "./cardioRow";
import { StrengthRow } from "./strengthRow";
import { Activity, Workout } from "types";
import { titleCase } from "utils";

interface Props {
  workout: Workout;
}

export const WorkoutCardContent = ({ workout }: Props) => {
  const createContent = (activity: Activity, children: React.ReactNode) => {
    const muscles = Object.keys(activity.muscleGroupStats).map((muscleGroup) =>
      titleCase(muscleGroup)
    );

    return (
      <Stack mb="$2" key={activity.id}>
        <Text mt={2} textAlign="left" fontSize={18} fontWeight="bold">
          {activity.name}{" "}
        </Text>
        <Text mb="$1.5" fontSize={14} color="$gray10Dark">
          {muscles.map((muscle) => muscle).join(", ")}
        </Text>
        {children}
      </Stack>
    );
  };

  return (
    <ScrollView>
      <Stack>
        {workout.activities.map((activity) => {
          switch (activity.type) {
            case "strength":
              return createContent(
                activity,
                <StrengthRow
                  key={activity.id}
                  activity={activity}
                  workout={workout}
                />
              );
            case "cardio":
              return createContent(
                activity,
                <CardioRow
                  key={activity.id}
                  activity={activity}
                  workout={workout}
                />
              );
            default:
              return null;
          }
        })}
      </Stack>
    </ScrollView>
  );
};
