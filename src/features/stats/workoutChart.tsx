import { useGetUser, useGetWorkoutData } from "api";
import { Button, Card, Heading, Select } from "components";
import React, { useEffect, useMemo, useState } from "react";
import { LineGraph } from "react-native-graph";
import { Spinner, Stack, Text, XStack, YStack, useTheme } from "tamagui";
import { ExerciseType, GraphType, StrengthActivity } from "types";
import {
  createDistanceFormatter,
  createWeightFormatter,
  getPastWorkouts,
} from "utils";

type GraphOverview = "All" | "3Months" | "1Month" | "1Week";

export const WorkoutChart = () => {
  const { data: user } = useGetUser();
  const theme = useTheme();

  const weightFormatter = createWeightFormatter(
    user?.userSettings?.weightUnit ?? "kilograms"
  );

  const distanceFormatter = createDistanceFormatter(
    user?.userSettings?.measurementUnit ?? "imperial"
  );

  const pastWorkouts = getPastWorkouts(user)
    .filter((workout) => workout.completed)
    .filter((workout) => workout.activities.length >= 1);

  const [graphOverview, setGraphOverview] = useState<GraphOverview>("All");
  const [title, setTitle] = useState<string | null>();
  const [titularData, setTitularData] = useState<{
    value: number;
    date: Date;
  } | null>(null);
  const [reps, setReps] = useState<number | null>(null);
  const [workoutType, setWorkoutType] = useState<ExerciseType | null>(
    "strength"
  );
  const [workoutGraphType, setWorkoutGraphType] = useState<GraphType>("Weight");
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const { data: workoutData, isLoading: workoutDataLoading } =
    useGetWorkoutData({
      exerciseName: selectedExercise,
      userId: user?.id ?? 0,
      workoutGraphType,
      reps,
    });

  const chartData = useMemo(() => {
    return (workoutData?.graphData ?? [])
      .map((data) => ({
        value: data.exerciseMetaData,
        date: new Date(data.timeOfExercise),
      }))
      .filter((data) => {
        const dataDate = data.date;
        const today = new Date();
        const oneWeekAgo = new Date(today.setDate(today.getDate() - 7));
        const oneMonthAgo = new Date(today.setDate(today.getDate() - 30));
        const threeMonthsAgo = new Date(today.setDate(today.getDate() - 90));

        if (graphOverview === "1Week") {
          return dataDate > oneWeekAgo;
        }

        if (graphOverview === "1Month") {
          return dataDate > oneMonthAgo;
        }

        if (graphOverview === "3Months") {
          return dataDate > threeMonthsAgo;
        }

        return data.value;
      });
  }, [graphOverview, workoutData]);

  useEffect(() => {
    if (chartData.length !== 0) {
      const lastDataPoint = chartData[chartData.length - 1];
      setTitularData(lastDataPoint);
    }
  }, [chartData]);

  useEffect(() => {
    if (titularData) {
      if (workoutGraphType === "Weight") {
        setTitle(`${weightFormatter(titularData.value.toString())}`);
      }

      if (workoutGraphType === "Distance") {
        setTitle(`${distanceFormatter(titularData.value.toString())}`);
      }

      if (workoutGraphType === "Reps") {
        setTitle(`${titularData.value} Reps`);
      }

      if (workoutGraphType === "Sets") {
        setTitle(`${titularData.value} Sets`);
      }
    }
  }, [
    chartData,
    distanceFormatter,
    titularData,
    weightFormatter,
    workoutGraphType,
  ]);

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
              activity.exercise.name === selectedExercise &&
              activity.type === "strength"
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

    return (
      <>
        <Heading mt={2}>{title}</Heading>
        <Text mt={2}> {titularData?.date.toDateString()} </Text>
        <LineGraph
          style={{
            paddingTop: 10,
            height: 200,
            width: 320,
            overflow: "visible",
            backgroundColor: "transparent",
          }}
          lineThickness={2}
          points={chartData}
          animated
          enablePanGesture
          onPointSelected={(p) => setTitularData(p)}
          color={theme.primary500.val}
        />
        <XStack space="$1" mx="auto" mt={2}>
          <Button
            style={{
              backgroundColor:
                graphOverview === "All" ? theme.gray200.val : "transparent",
            }}
            variant="link"
            w="25%"
            accessibilityLabel="All"
            onPress={() => setGraphOverview("All")}
          >
            All
          </Button>
          <Button
            style={{
              backgroundColor:
                graphOverview === "3Months" ? theme.gray200.val : "transparent",
            }}
            variant="link"
            w="25%"
            accessibilityLabel="3 Months"
            onPress={() => setGraphOverview("3Months")}
          >
            3M
          </Button>
          <Button
            style={{
              backgroundColor:
                graphOverview === "1Month" ? theme.gray200.val : "transparent",
            }}
            variant="link"
            w="25%"
            accessibilityLabel="1 Month"
            onPress={() => setGraphOverview("1Month")}
          >
            1M
          </Button>
          <Button
            style={{
              backgroundColor:
                graphOverview === "1Week" ? theme.gray200.val : "transparent",
            }}
            variant="link"
            w="25%"
            accessibilityLabel="1 Week"
            onPress={() => setGraphOverview("1Week")}
          >
            1W
          </Button>
        </XStack>
      </>
    );
  }, [
    workoutDataLoading,
    workoutData,
    selectedExercise,
    title,
    titularData?.date,
    chartData,
    theme.primary500.val,
    theme.gray200.val,
    graphOverview,
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
          value={{
            label: selectedExercise ?? "",
            value: selectedExercise ?? "",
          }}
          data={exerciseNames.map((name) => ({
            label: name,
            value: name,
          }))}
          onChangeValue={(item) => {
            setSelectedExercise(item);
            setWorkoutGraphType("Weight");
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
              setReps(repCounts[0] ?? 0);
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
