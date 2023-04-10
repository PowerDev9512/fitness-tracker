import { Card } from "components";
import { useMemo } from "react";
import { Separator, Text } from "tamagui";
import { StrengthActivity, Workout } from "types";
import { titleCase } from "utils";

import { ActivityEntry } from "./activityEntry";

interface Props {
  workout: Workout;
  onDeleteActivity: (field: string, workout: Workout) => void;
}

type ExerciseSummary = {
  [key: string]: number;
  total: number;
};

export const ActivitySummary = ({ workout, onDeleteActivity }: Props) => {
  const calculateStrengthVolume = (exercise: StrengthActivity): number => {
    const { targetSets, targetReps, targetWeight } = exercise;
    return targetSets * targetReps * targetWeight;
  };

  const deleteActivity = (activityIndex: number) => () => {
    const newActivities = [...workout.activities];
    newActivities.splice(activityIndex, 1);
    onDeleteActivity("workout", { ...workout, activities: newActivities });
  };

  const summary = useMemo(() => {
    const summaries = workout.activities.reduce(
      (acc, curr) => {
        const {
          type,
          mainMuscleGroup,
          otherMuscleGroups,
          detailedMuscleGroup,
        } = curr.exercise;
        if (type === "strength") {
          const volume = calculateStrengthVolume(curr as StrengthActivity);

          const muscleGroups = otherMuscleGroups
            .concat(mainMuscleGroup)
            .concat(detailedMuscleGroup ?? "unknown")
            .filter((x) => x.toLowerCase() !== "unknown");

          const volumes = muscleGroups.reduce(
            (acc2, curr2) => {
              const existingVolume = acc[curr2] ?? 0;
              return {
                ...acc2,
                [curr2]: existingVolume + volume,
                total: acc2.total + volume,
              };
            },
            { total: 0 } as ExerciseSummary
          );

          return {
            ...acc,
            ...volumes,
            total: acc.total + volumes.total,
          };
        }
        return { ...acc };
      },
      { total: 0 } as ExerciseSummary
    );

    const { total } = summaries;

    return Object.entries(summaries)
      .filter(([key]) => key !== "total")
      .map(([key, value]) => {
        const percentage = Math.round((value / total) * 100);
        return `${titleCase(key)}: ${percentage}%`;
      })
      .join(", ");
  }, [workout.activities]);

  return (
    <Card my="$2" p="$2">
      {summary !== "" && (
        <>
          <Text mt="$2">{summary}</Text>
          <Separator mt="$2" />
        </>
      )}

      {workout.activities.length > 0 ? (
        workout.activities.map((currentActivity, i) => (
          <ActivityEntry
            key={currentActivity.id}
            activity={currentActivity}
            deleteActivity={deleteActivity(i)}
          />
        ))
      ) : (
        <Text py="$1">No exercises added yet</Text>
      )}
    </Card>
  );
};
