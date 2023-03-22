import { Star } from "@tamagui/lucide-icons";
import { useExercises } from "api";
import {
  Accordion,
  CachedImage,
  Card,
  FilterOption,
  Filters,
  Skeleton,
} from "components";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView } from "react-native";
import { Text, XStack } from "tamagui";
import { Equipments, Exercise, ExerciseTypes, MuscleGroups } from "types";
import { titleCase } from "utils";

import { CreateWorkoutProps } from "../createWorkout";

interface BaseProps {
  incrementIndex: () => void;
}

type Props = BaseProps & CreateWorkoutProps;

interface MuscleGroupData {
  name: string;
  exercises: Exercise[];
}

const filterOptions: FilterOption[] = [
  {
    name: "muscleGroup",
    values: Object.values(MuscleGroups),
    placeholder: "Muscles",
  },
  {
    name: "equipment",
    values: Object.values(Equipments),
    placeholder: "Equipment",
  },
  {
    name: "type",
    values: Object.values(ExerciseTypes),
    placeholder: "Type",
  },
];

export const SelectWorkout = ({ form, incrementIndex }: Props) => {
  const [filters, setFilters] = useState<Record<string, string | undefined>>({
    muscleGroup: undefined,
    equipment: undefined,
    type: undefined,
  });

  const { data, isLoading } = useExercises({ retrieveImages: false });

  const filteredExercises = useMemo(() => {
    if (!data) return [];

    return data
      .filter((exercise) => {
        if (
          filters.muscleGroup &&
          exercise.mainMuscleGroup.toLocaleLowerCase() !==
            filters.muscleGroup.toLocaleLowerCase()
        )
          return false;
        if (
          filters.equipment &&
          exercise.equipment.toLocaleLowerCase() !==
            filters.equipment.toLocaleLowerCase()
        )
          return false;
        if (
          filters.type &&
          exercise.type.toLocaleLowerCase() !== filters.type.toLocaleLowerCase()
        )
          return false;
        return true;
      })
      .sort((a, b) => (a.userHasMax ? -1 : 1));
  }, [data, filters]);

  const createCardContent = useCallback(
    (muscleGroup: MuscleGroupData) => {
      const handleExerciseChange = (exercise: Exercise) => {
        if (exercise) {
          if (exercise.type === "strength") {
            form.setFieldValue("activity", {
              ...exercise,
              reps: null,
              sets: null,
              weight: null,
              targetReps: 0,
              targetSets: 0,
              targetWeight: 0,
            });
          }
          if (exercise.type === "cardio") {
            form.setFieldValue("activity", {
              ...exercise,
              distance: null,
              duration: null,
              targetDistance: 0,
              targetDuration: 0,
            });
          }
          incrementIndex();
        }
      };

      return (
        <FlatList
          nestedScrollEnabled
          data={muscleGroup.exercises}
          keyExtractor={(item) => item.exerciseId.toString()}
          ListEmptyComponent={<Text>No exercises found</Text>}
          renderItem={({ item: exercise }) => (
            <Pressable onPress={() => handleExerciseChange(exercise)}>
              <XStack alignItems="center" space={2} my={2} p={2}>
                <Text w="80%" color="black" my="auto">
                  {exercise.name}
                </Text>
                {exercise.userHasMax && (
                  <Star
                    color="$primary500"
                    size={25}
                    style={{ marginLeft: "auto" }}
                  />
                )}
                <CachedImage
                  style={{ width: 60, height: 50, marginLeft: "auto" }}
                  alt={`${exercise.name} image`}
                  fileName={`${exercise.muscleGroupImageId}.png`}
                />
              </XStack>
            </Pressable>
          )}
        />
      );
    },
    [form, incrementIndex]
  );

  const skeletons = Array.from({ length: 10 }, (_, i) => i).map((i) => (
    <Skeleton key={`skeleton-${i}`} height={82} my={2} />
  ));

  const content = useMemo(() => {
    const exercisesFor = (muscleGroup: string): MuscleGroupData => {
      const exercises = filteredExercises.filter((exercise) => {
        const compareStrings = (a: string, b: string) =>
          a.toLowerCase() === b.toLowerCase();
        const muscleGroups = exercise.otherMuscleGroups
          .concat(exercise.mainMuscleGroup)
          .concat(exercise.detailedMuscleGroup ?? "Unknown");
        return muscleGroups.some((curr) => compareStrings(curr, muscleGroup));
      });

      return { name: muscleGroup, exercises };
    };

    const whereExercisesExist = (muscleGroup: MuscleGroupData) =>
      muscleGroup.exercises.length > 0;

    const createCard = (muscleGroup: MuscleGroupData) => (
      <Card my="$2" p="$2.5" key={`card-${muscleGroup.name}`}>
        <Accordion
          title={titleCase(muscleGroup.name)}
          secondTitle={`${muscleGroup.exercises.length} exercises`}
          key={`${muscleGroup.name}-accordion`}
        >
          {createCardContent(muscleGroup)}
        </Accordion>
      </Card>
    );

    return MuscleGroups.map(exercisesFor)
      .filter(whereExercisesExist)
      .map(createCard);
  }, [filteredExercises, createCardContent]);

  return (
    <ScrollView
      nestedScrollEnabled
      style={{ marginTop: 10, marginLeft: "auto", marginRight: -35 }}
      stickyHeaderIndices={[0]}
    >
      <Filters
        filterOptions={filterOptions}
        filters={filters}
        setFilters={setFilters}
      />
      {isLoading ? skeletons : content}
    </ScrollView>
  );
};
