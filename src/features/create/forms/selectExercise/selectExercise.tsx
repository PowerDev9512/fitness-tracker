import { useExercises } from "api";
import { FilterOption, Filters, Skeleton } from "components";
import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { Equipments, Exercise, ExerciseTypes, MuscleGroups } from "types";

import { ExerciseAccordion } from "./exerciseAccordion";
import { CreateWorkoutProps } from "../../createWorkout";

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

export const SelectExercise = ({ form, incrementIndex }: Props) => {
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

  const skeletons = Array.from({ length: 10 }, (_, i) => i).map((i) => (
    <Skeleton key={`skeleton-${i}`} height={82} my={4} />
  ));

  const content = useMemo(() => {
    const getMatchingExercises = (muscleGroup: string): MuscleGroupData => {
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

    const createAccordionForExercises = (muscleGroup: MuscleGroupData) => (
      <ExerciseAccordion
        key={muscleGroup.name}
        muscleGroup={muscleGroup}
        updateActivity={form.setFieldValue}
        incrementIndex={incrementIndex}
      />
    );

    return MuscleGroups.map(getMatchingExercises)
      .filter(whereExercisesExist)
      .map(createAccordionForExercises);
  }, [filteredExercises]);

  return (
    <ScrollView
      nestedScrollEnabled
      style={{ marginTop: 10, width: "110%", marginLeft: "10%" }}
      stickyHeaderIndices={[0]}
    >
      <Filters
        filterOptions={filterOptions}
        filters={filters}
        setFilters={setFilters}
        width="88%"
      />
      {isLoading ? skeletons : content}
    </ScrollView>
  );
};
