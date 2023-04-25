import { useGetUser, useGetWorkoutData } from "api";
import { Card, Heading, Select } from "components";
import React, { useMemo, useState } from "react";
import { Spinner, Stack, Text, YStack, useTheme } from "tamagui";
import { ExerciseType, GraphType, StrengthActivity, StrengthData, StrengthExercise } from "types";
import { createDistanceFormatter, createWeightFormatter, getPastWorkouts } from "utils";
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory-native";

export const WorkoutChart = () => {
  const { data: user } = useGetUser();
  const theme = useTheme();

  const weightFormatter = createWeightFormatter(user?.userSettings?.weightUnit ?? "kilograms");
  const distanceFormatter = createDistanceFormatter(user?.userSettings?.measurementUnit ?? "imperial");

  const pastWorkouts = getPastWorkouts(user)
    .filter((workout) => workout.completed)
    .filter((workout) => workout.activities.length >= 1);

  const [reps, setReps] = useState<number | null>(null);
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
        .map((activity) => activity.exercise.name)
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
            (activity) =>
              activity.exercise.name === selectedExercise && activity.type === "strength"
          )
          .map((exercise) => exercise as StrengthActivity)
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

    if (!workoutData) {
      return <Text mt={10}> Not enough workout data exists, train more! </Text>;
    }

    if (!selectedExercise) {
      return <Text mt={10}> Select an exercise to graph </Text>;
    }

    if ([0, 1].includes(workoutData.graphData.length)) {
      return <Text mt={10}> Not enough workout data exists, train more! </Text>;
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
      <VictoryChart style={{ parent: { maxWidth: "100%" } }} containerComponent={<VictoryVoronoiContainer />}>
        <VictoryArea
          interpolation="natural"
          labelComponent={<VictoryTooltip renderInPortal={false} />}
          domainPadding={{ x: 2 }}
          domain={{ y: [0, highestValue * 1.3], x: [chartData.length, chartData.length + 0.4] }}
          style={{
            data: {
              fill: theme.primary300.val,
              strokeWidth: 3,
              zIndex: 1,
              width: 10,
            },
          }}
          data={chartData}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(x) => {
            if (workoutGraphType === "Weight") {
              return weightFormatter(x, false);
            } else if (workoutGraphType === "Distance") {
              return distanceFormatter(x, false);
            } else {
              return x;
            }
          }}
          style={{
            axis: { stroke: "transparent" },
            grid: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
            tickLabels: { fontSize: 12 },
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: "transparent" },
            grid: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
            tickLabels: { fontSize: 12 },
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
      <Heading>Workout Graphs</Heading>

      <YStack ml="$-3.5" w="110%">
        <Select
          mr="auto"
          borderWidth={0}
          data={[
            {
              label: "Clear",
              value: "clear",
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
          placeholder="Type"
          value={{ label: workoutType ?? "Clear", value: workoutType ?? "" }}
          onChangeValue={(item) => {
            if (item === "") {
              setWorkoutType(null);
              setSelectedExercise(null);
            } else {
              setWorkoutType(item);
              setSelectedExercise(null);
            }
          }}
        />

        <Select
          mr="auto"
          borderWidth={0}
          value={{ label: selectedExercise ?? "", value: selectedExercise ?? "" }}
          data={exerciseNames.map((name) => ({
            label: name,
            value: name,
          }))}
          onChangeValue={(item) => {
            setSelectedExercise(item);
            setWorkoutGraphType("Reps");
          }}
          isDisabled={!exerciseNames.length || workoutType === null}
          placeholder="Select an exercise"
        />

        <Select
          mr="auto"
          borderWidth={0}
          value={{ label: workoutGraphType, value: workoutGraphType }}
          data={options.map((name) => ({
            label: name,
            value: name,
          }))}
          onChangeValue={(item) => {
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
          <Select
              mr="auto"
              borderWidth={0}
              value={{
                label: reps ? reps.toString() : "Select a rep range",
                value: reps,
              }}
              data={repCounts.map((count) => ({
                label: count.toString(),
                value: count,
              }))}
              onChangeValue={(item) => setReps(item)}
              placeholder="Select a rep range"
            />
          )}
      </YStack>

      <Stack marginLeft="auto" marginRight="auto">
        {content}
      </Stack>
    </Card>
  );
};
