import { useGetUser, useGetWorkoutData } from "api";
import { Card, Heading } from "components";
import React, { useMemo, useState } from "react";
import { Spinner, Stack, Text, XStack, YStack } from "tamagui";
import { ExerciseType, GraphType, StrengthData, StrengthExercise } from "types";
import { getPastWorkouts } from "utils";
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryTooltip,
} from "victory-native";

import { Dropdown } from "./workoutChart.styles";

export const WorkoutChart = () => {
  const { data: user } = useGetUser();

  const pastWorkouts = getPastWorkouts(user)
    .filter((workout) => workout.completed)
    .filter((workout) => workout.activities.length > 1);

  const [reps, setReps] = useState<number>(0);
  const [workoutType, setWorkoutType] = useState<ExerciseType | null>(
    "strength"
  );
  const [workoutGraphType, setWorkoutGraphType] = useState<GraphType>("Reps");
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const { data: workoutData, isLoading: workoutDataLoading } =
    useGetWorkoutData({
      exerciseName: selectedExercise,
      userId: user?.id ?? 0,
      workoutGraphType,
      reps,
    });

  const exerciseNames = useMemo(
    () =>
      pastWorkouts
        .flatMap((workout) => workout.activities)
        .filter((activity) => activity.type === workoutType)
        .map((exercise) => exercise.name)
        .filter((name, index, self) => self.indexOf(name) === index),
    [pastWorkouts, workoutType]
  );

  const options =
    workoutType === "strength"
      ? ["Reps", "Sets", "Weight"]
      : ["Distance", "Duration"];

  const repCounts = useMemo(
    () => [
      ...new Set(
        pastWorkouts
          .flatMap((workout) => workout.activities)
          .filter(
            (exercise) =>
              exercise.name === selectedExercise && exercise.type === "strength"
          )
          .map((exercise) => exercise as StrengthExercise & StrengthData)
          .map((exercise) => exercise.reps)
          .filter((currReps) => currReps) as number[]
      ),
    ],
    [pastWorkouts, selectedExercise]
  );

  const content = useMemo(() => {
    if (workoutDataLoading) {
      return <Spinner mt={10} />;
    }

    if (
      !workoutData ||
      Object.entries(workoutData?.graphData ?? {}).length === 0 ||
      pastWorkouts
        .flatMap((workout) => workout.activities)
        .map((activity) => activity.type === workoutType).length === 0
    ) {
      return <Text mt={10}> Not enough workout data exists, train more! </Text>;
    }

    if (!selectedExercise) {
      return <Text mt={10}> Select an exercise to graph </Text>;
    }

    const chartData = workoutData.graphData.map((data) => ({
      x: data.xAxis.toString(),
      y: data.exerciseMetaData,
      label: new Date(data.timeOfExercise).toLocaleDateString(),
    }));

    const highestValue = Math.max(
      ...workoutData.graphData.map((data) => data.exerciseMetaData)
    );

    return (
      <VictoryChart style={{ parent: { maxWidth: "100%" } }}>
        <VictoryArea
          interpolation="natural"
          labelComponent={<VictoryTooltip renderInPortal={false} />}
          domainPadding={{ x: 2 }}
          domain={{ y: [0, highestValue * 1.2] }}
          style={{
            data: {
              fill: "url(#gradient)",
              strokeWidth: 3,
              zIndex: 1,
              width: 10,
            },
          }}
          data={chartData}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "transparent" },
            grid: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
            tickLabels: { fontSize: 15 },
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: "transparent" },
            grid: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
            tickLabels: { fontSize: 15, padding: -20 },
          }}
        />
      </VictoryChart>
    );
  }, [
    workoutDataLoading,
    workoutData,
    pastWorkouts,
    selectedExercise,
    workoutType,
  ]);

  return (
    <Card p="$4">
      <XStack>
        <Heading>Workout Graphs</Heading>

        <YStack w="55%" ml="$1">
          <Dropdown
            data={[
              {
                label: "Clear",
                value: "",
              },
              {
                label: "Strength",
                value: "strength",
              },
              {
                label: "Cardio",
                value: "cardio",
              },
            ]}
            labelExtractor={(item: any) => item.label}
            placeholder="Type"
            value={workoutType ?? ""}
            onChangeValue={(item: any) => {
              if (item.value === "") {
                setWorkoutType(null);
                setSelectedExercise(null);
              } else {
                setWorkoutType(item.value);
              }
            }}
          />

          <Dropdown
            value={selectedExercise ?? ""}
            data={exerciseNames.map((name) => ({
              label: name,
              value: name,
            }))}
            labelExtractor={(item: any) => item.label}
            onChangeValue={(item: any) => setSelectedExercise(item.value)}
            isDisabled={!exerciseNames.length || workoutType === null}
            placeholder="Select an exercise"
          />

          <Dropdown
            value={workoutGraphType ?? ""}
            data={options.map((name) => ({
              label: name,
              value: name,
            }))}
            labelExtractor={(item: any) => item.label}
            onChangeValue={(item: any) => {
              if (item === "weight") {
                setReps(0);
              }
              setWorkoutGraphType(item as GraphType);
            }}
            isDisabled={!selectedExercise}
            placeholder="Select unit type"
          />

          {workoutType === "strength" &&
            selectedExercise !== null &&
            workoutGraphType.toLocaleLowerCase() === "weight" && (
              <Dropdown
                value={reps.toString()}
                data={repCounts.map((count) => ({
                  label: count.toString(),
                  value: count,
                }))}
                labelExtractor={(item: any) => item.label}
                onChangeValue={(item: any) => setReps(item.value)}
                placeholder="Select rep range"
              />
            )}
        </YStack>
      </XStack>

      <Stack marginLeft="auto" marginRight="auto">
        {content}
      </Stack>
    </Card>
  );
};
