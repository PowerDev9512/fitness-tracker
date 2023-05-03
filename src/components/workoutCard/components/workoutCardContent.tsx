import React from "react";
import { Text, ScrollView, Stack } from "tamagui";
import { Activity, Workout } from "types";
import { titleCase } from "utils";

import { CardioRow } from "./cardioRow";
import { StrengthRow } from "./strengthRow";

interface Props {
  workout: Workout;
}

const isStrengthActivityCompleted = (activity: Activity) => {
  if (activity.type !== "strength") return false;
  return (
    activity.sets !== undefined &&
    activity.reps !== undefined &&
    activity.weight !== undefined
  );
};

const isCardioActivityCompleted = (activity: Activity) => {
  if (activity.type !== "cardio") return false;
  return activity.duration !== undefined && activity.distance !== undefined;
};

export const WorkoutCardContent = ({ workout }: Props) => {
  const activitesSortedByUncompleted = workout.activities.sort(
    (a, b) =>
      (isStrengthActivityCompleted(a) ? 1 : 0) -
      (isStrengthActivityCompleted(b) ? 1 : 0) +
      (isCardioActivityCompleted(a) ? 1 : 0) -
      (isCardioActivityCompleted(b) ? 1 : 0)
  );

  const createContent = (activity: Activity, children: React.ReactNode) => {
    const muscles = Object.keys(activity.exercise.muscleGroupStats).map(
      (muscleGroup) => titleCase(muscleGroup)
    );

    return (
      <Stack mb="$2" key={activity.id}>
        <Text mt={2} textAlign="left" fontSize={18} fontWeight="bold">
          {activity.exercise.name}{" "}
        </Text>
        <Text mt="$1" fontSize={14} color="$gray10Dark">
          {muscles.map((muscle) => muscle).join(", ")}
        </Text>
        {children}
      </Stack>
    );
  };

  return (
    <ScrollView nestedScrollEnabled>
      {activitesSortedByUncompleted.map((activity) => {
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
    </ScrollView>
  );
};
