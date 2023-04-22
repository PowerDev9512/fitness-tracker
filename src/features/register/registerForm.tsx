import {
  Autocomplete,
  Avatar,
  Button,
  FormInput,
  FormLabel,
  Heading,
  IconButton,
  RadioButton,
} from "components";
import React from "react";
import { ScrollView, Separator, Stack, Text, XStack } from "tamagui";
import { Exercise, Image } from "types";
import { createWeightFormatter } from "utils";

import { RegisterProps, RegisterValues } from "./register";

type Props = RegisterProps & {
  exercises: Exercise[];
};

export const RegisterForm = ({ form, exercises }: Props) => {
  const handleImageChange = (image: Image) => {
    form.setFieldValue("avatar", image);
  };

  const weightFormatter = createWeightFormatter(form.values.weightUnit);

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
    <ScrollView w="90%" mb="$4">
      <Avatar
        mx="auto"
        user={null}
        size="xl"
        callback={handleImageChange}
        editable
      />

      <Heading textAlign="left" mt="$4">
        Details
      </Heading>
      <Separator scale={2} my="$3" borderColor="$gray500" />

      <FormInput
        required
        onChangeText={form.handleChange("username")}
        onBlur={form.handleBlur("username")}
        value={form.values.username}
        name="Username"
        error={
          form.errors.username && form.touched.username
            ? form.errors.username
            : undefined
        }
      />
      <FormInput
        required
        onChangeText={form.handleChange("email")}
        onBlur={form.handleBlur("email")}
        value={form.values.email.trimEnd()}
        name="Email"
        error={
          form.errors.email && form.touched.email
            ? form.errors.email
            : undefined
        }
      />
      <FormInput
        required
        type="password"
        onChangeText={form.handleChange("password")}
        onBlur={form.handleBlur("password")}
        value={form.values.password}
        name="Password"
        error={
          form.errors.password && form.touched.password
            ? form.errors.password
            : undefined
        }
      />
      <FormInput
        required
        type="password"
        onChangeText={form.handleChange("confirmPassword")}
        onBlur={form.handleBlur("confirmPassword")}
        value={form.values.confirmPassword}
        name="Confirm Password"
        error={
          form.errors.confirmPassword && form.touched.confirmPassword
            ? form.errors.confirmPassword
            : undefined
        }
      />

      <Heading textAlign="left" mt="$4">
        Settings
      </Heading>
      <Separator scale={2} my="$3" borderColor="$gray500" />

      <XStack mt="$2">
        <Stack mb="$4" mr="auto">
          <FormLabel>Measurement Unit</FormLabel>
          {["Metric", "Imperial"].map((unit) => (
            <XStack key={unit} alignItems="center">
              <RadioButton
                key={unit}
                checked={form.values.measurementUnit === unit.toLowerCase()}
                value={unit.toLowerCase()}
                onValueChange={(value) =>
                  form.setFieldValue("measurementUnit", value)
                }
              />
              <FormLabel ml={2}>{unit}</FormLabel>
            </XStack>
          ))}
        </Stack>

        <Stack mb="$4" mr="auto">
          <FormLabel>Height</FormLabel>
          {["Kilograms", "Pounds"].map((unit) => (
            <XStack key={unit} alignItems="center">
              <RadioButton
                key={unit}
                value={unit.toLowerCase()}
                checked={form.values.weightUnit === unit.toLowerCase()}
                onValueChange={(value) =>
                  form.setFieldValue("weightUnit", value)
                }
              />
              <FormLabel ml={2}>{unit}</FormLabel>
            </XStack>
          ))}
        </Stack>
      </XStack>

      <Heading textAlign="left" mt="$4">
        Maxes
      </Heading>
      <Separator scale={2} my="$3" borderColor="$gray500" />

      <FormLabel mr="auto">Exercise</FormLabel>
      <Autocomplete
        viewProps={{
          w: "100%",
        }}
        inputProps={{
          placeholder: "(Optional) Select an exercise to add a max for",
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

      <Button
        mb="$4"
        w="100%"
        onPress={() => {
          form.handleSubmit();
        }}
      >
        Submit
      </Button>
    </ScrollView>
  );
};
