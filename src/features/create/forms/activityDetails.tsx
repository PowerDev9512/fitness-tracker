import { Card, DatePicker, FormLabel } from "components";
import React, { useMemo } from "react";
import { Separator, Slider, Stack, Text } from "tamagui";
import { titleCase } from "utils";

import { StrengthData, StrengthExercise } from "../../../types/domain";
import { ActivityEntry } from "../components/activityEntry/activityEntry";
import { CreateWorkoutProps } from "../createWorkout";

export const ActivityDetails = ({ form }: CreateWorkoutProps) => {
  const { date, repeat } = form.values;
  const setDate = (newDate: Date) => form.setFieldValue("date", newDate);
  const setRepeat = (newRepeat: number[]) =>
    form.setFieldValue("repeat", newRepeat);

  const { workout } = form.values;

  const summary = useMemo(() => {
    type ExerciseSummary = {
      [key: string]: number;
      total: number;
    };

    const calculateStrengthVolume = (
      exercise: StrengthExercise & StrengthData
    ): number => {
      const { targetSets, targetReps, targetWeight } = exercise;
      return targetSets * targetReps * targetWeight;
    };

    const summaries = workout.activities.reduce(
      (acc, curr) => {
        const {
          type,
          mainMuscleGroup,
          otherMuscleGroups,
          detailedMuscleGroup,
        } = curr;
        if (type === "strength") {
          const volume = calculateStrengthVolume(
            curr as StrengthExercise & StrengthData
          );

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
  }, [workout]);

  const deleteActivity = (activityIndex: number) => () => {
    const newActivities = [...workout.activities];
    newActivities.splice(activityIndex, 1);
    form.setFieldValue("workout", { ...workout, activities: newActivities });
  };

  return (
    <>
      <FormLabel mr="auto" ml="$4">Summary</FormLabel>
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

      <FormLabel mb="$-2" mr="auto" ml="$4">Workout date</FormLabel>
      <Card mb="$2">
        <DatePicker date={date} setDate={setDate} mode="date" />
      </Card>

      <FormLabel mr="auto" ml="$4">
        Schedule this for {repeat} {repeat === 1 ? "week" : "weeks"}
      </FormLabel>

      <Card mt="$2">
        <Slider
          defaultValue={[1]}
          value={[repeat]}
          onValueChange={setRepeat}
          max={10}
          min={1}
          step={1}
          size="$4"
          mx="auto"
          w="90%"
          h={60}
        >
          <Slider.Track backgroundColor="$gray200">
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb
            bordered
            elevate
            circular
            index={0}
            backgroundColor="$primary500"
          />
        </Slider>
      </Card>
    </>
  );
};
