import { Autocomplete, Button, FormInput, FormLabel, IconButton } from "components";
import React from "react";
import { Stack, XStack } from "tamagui";
import { createMeasurementFormatter, createWeightFormatter } from "utils";

import { Exercise } from "../../../../types/domain";
import { RegisterProps } from "../../register";

type Props = RegisterProps & {
  exercises: Exercise[];
};

export const StatsForm = ({ form, exercises }: Props) => {
  const weightFormatter = createWeightFormatter(form.values.weightUnit);
  const measurementFormatter = createMeasurementFormatter(
    form.values.measurementUnit
  );
  const [selectedExercise, setSelectedExercise] =
    React.useState<Exercise | null>(null);
  const [exerciseText, setExerciseText] = React.useState<string>("");

  const filteredExercises = React.useMemo(() => {
    const exercisesToRemove = Object.keys(form.values.maxes);
    return exercises.filter(
      (exercise) => !exercisesToRemove.includes(exercise.name)
    );
  }, [exercises, form.values.maxes]);

  const createNewMax = (exercise: Exercise) => {
    form.setFieldValue("maxes", {
      ...form.values.maxes,
      [exercise.name]: {
        reps: 0,
        weight: 0,
      },
    });
  };

  const maxes = Object.entries(form.values.maxes).map(([exerciseName, max]) => (
    <Stack>
      <FormLabel mt={4}>{exerciseName}</FormLabel>
      <XStack space="$4" w="40%" alignItems="center" key={exerciseName}>
        <FormInput
          key={`weight-${exerciseName}`}
          onChangeText={form.handleChange(`maxes.${exerciseName}.weight`)}
          onBlur={form.handleBlur(`maxes.${exerciseName}.weight`)}
          value={max.weight.toString()}
          required
          error={
            form.errors.maxes?.[exerciseName]?.weight &&
            form.touched.maxes?.[exerciseName]?.weight
              ? form.errors.maxes?.[exerciseName]?.weight
              : undefined
          }
          name={weightFormatter("Weight")}
        />
        <FormInput
          key={`reps-${exerciseName}`}
          onChangeText={form.handleChange(`maxes.${exerciseName}.reps`)}
          onBlur={form.handleBlur(`maxes.${exerciseName}.reps`)}
          value={max.reps.toString()}
          required
          error={
            form.errors.maxes?.[exerciseName]?.reps &&
            form.touched.maxes?.[exerciseName]?.reps
              ? form.errors.maxes?.[exerciseName]?.reps
              : undefined
          }
          name="Reps"
        />
        <IconButton
          key={`remove-${exerciseName}`}
          icon="close"
          mt="$6"
          color="$red500"
          size={24}
          onPress={() => {
            form.setFieldValue(
              "maxes",
              Object.fromEntries(
                Object.entries(form.values.maxes).filter(
                  ([name]) => name !== exerciseName
                )
              )
            );
          }}
        >
          Remove
        </IconButton>
      </XStack>
    </Stack>
  ));

  return (
    <Stack w="90%">
      <FormInput
        onChangeText={form.handleChange("height")}
        onBlur={form.handleBlur("height")}
        value={form.values.height.toString()}
        required
        error={
          form.errors.height && form.touched.height
            ? form.errors.height
            : undefined
        }
        name={measurementFormatter("Height")}
      />
      <FormInput
        onChangeText={form.handleChange("weight")}
        onBlur={form.handleBlur("weight")}
        value={form.values.weight.toString()}
        required
        error={
          form.errors.weight && form.touched.weight
            ? form.errors.weight
            : undefined
        }
        name={weightFormatter("Weight")}
      />
      <FormInput
        onChangeText={form.handleChange("age")}
        onBlur={form.handleBlur("age")}
        value={form.values.age.toString()}
        required
        error={
          form.errors.age && form.touched.age ? form.errors.age : undefined
        }
        name="Age"
      />
      <FormLabel mr="auto">Exercise maxes</FormLabel>
      <Autocomplete
        viewProps={{
          w: "100%",
        }}
        inputProps={{
          placeholder: "Select an exercise to add a max for"
        }}
        data={filteredExercises ?? []}
        value={exerciseText}
        keyExtractor={(item: Exercise) => item.name}
        onChange={(value: string) => {
          setSelectedExercise(
            filteredExercises?.find((e) => e.name === value) ?? null
          );
          setExerciseText(value);
        }}
      />
      {maxes}
      <Button
        mb="$4"
        mt="$4"
        w="100%"
        disabled={selectedExercise === null}
        onPress={() => {
          createNewMax(selectedExercise ?? ({} as Exercise));
          setSelectedExercise(null);
          setExerciseText("");
        }}
      >
        Add New Exercise Max
      </Button>
    </Stack>
  );
};
