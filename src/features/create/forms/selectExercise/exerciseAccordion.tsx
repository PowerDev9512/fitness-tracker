import { useGetUser } from "api";
import { Accordion, Card } from "components";
import { useMemo } from "react";
import { FlatList, ListRenderItemInfo } from "react-native";
import { Text } from "tamagui";
import { Activity, CardioActivity, Exercise, StrengthActivity } from "types";
import { titleCase } from "utils";

import { ExerciseAccordionEntry } from "./exerciseAccordionEntry";

interface Props {
  muscleGroup: MuscleGroupData;
  updateActivity: (formEntry: string, activity: Activity) => void;
  incrementIndex: () => void;
}

interface MuscleGroupData {
  name: string;
  exercises: Exercise[];
}

export const ExerciseAccordion = ({
  muscleGroup,
  updateActivity,
  incrementIndex,
}: Props) => {
  const { data: user } = useGetUser();

  const sortedExercises = muscleGroup.exercises
    .sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    })
    .sort((a, b) => {
      const aMax = user?.maxes.find((max) => max.exercise === a.name);
      const bMax = user?.maxes.find((max) => max.exercise === b.name);
      if (aMax && bMax) {
        return aMax.weight > bMax.weight ? -1 : 1;
      }
      if (aMax) {
        return -1;
      }
      if (bMax) {
        return 1;
      }
      return 0;
    });

  const renderExercise = useMemo(
    () =>
      ({ item: exercise }: ListRenderItemInfo<Exercise>) => {
        const handleExerciseChange = (exercise: Exercise) => {
          if (exercise) {
            if (exercise.type === "strength") {
              updateActivity("activity", {
                id: 0,
                exercise,
                type: "strength",
                reps: null,
                sets: null,
                weight: null,
                targetReps: 0,
                targetSets: 0,
                targetWeight: 0,
              } as StrengthActivity);
            }
            if (exercise.type === "cardio") {
              updateActivity("activity", {
                id: 0,
                exercise,
                type: "cardio",
                distance: null,
                duration: null,
                targetDistance: 0,
                targetDuration: 0,
              } as CardioActivity);
            }
            incrementIndex();
          }
        };

        return (
          <ExerciseAccordionEntry
            exercise={exercise}
            onPress={handleExerciseChange}
          />
        );
      },
    [incrementIndex, updateActivity]
  );

  return (
    <Card w="90%" my="$2" p="$2.5" key={`card-${muscleGroup.name}`}>
      <Accordion
        title={titleCase(muscleGroup.name)}
        secondTitle={`${muscleGroup.exercises.length} exercises`}
        key={`${muscleGroup.name}-accordion`}
      >
        <FlatList
          nestedScrollEnabled
          data={sortedExercises}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text>No exercises found</Text>}
          renderItem={renderExercise}
        />
      </Accordion>
    </Card>
  );
};
