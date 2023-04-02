import { Accordion, Card } from "components";
import { FlatList } from "react-native";
import { Text } from "tamagui";
import { CardioExercise, Exercise, StrengthExercise } from "types";
import { titleCase } from "utils";

import { ExerciseAccordionEntry } from "./exerciseAccordionEntry";

interface Props {
  muscleGroup: MuscleGroupData;
  updateActivity: (formEntry: string, activity: Exercise) => void;
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
  const handleExerciseChange = (exercise: Exercise) => {
    if (exercise) {
      if (exercise.type === "strength") {
        updateActivity("activity", {
          ...exercise,
          reps: null,
          sets: null,
          weight: null,
          targetReps: 0,
          targetSets: 0,
          targetWeight: 0,
        } as StrengthExercise);
      }
      if (exercise.type === "cardio") {
        updateActivity("activity", {
          ...exercise,
          distance: null,
          duration: null,
          targetDistance: 0,
          targetDuration: 0,
        } as CardioExercise);
      }
      incrementIndex();
    }
  };

  return (
    <Card w="90%" my="$2" p="$2.5" key={`card-${muscleGroup.name}`}>
      <Accordion
        title={titleCase(muscleGroup.name)}
        secondTitle={`${muscleGroup.exercises.length} exercises`}
        key={`${muscleGroup.name}-accordion`}
      >
        <FlatList
          nestedScrollEnabled
          data={muscleGroup.exercises}
          keyExtractor={(item) => item.exerciseId.toString()}
          ListEmptyComponent={<Text>No exercises found</Text>}
          renderItem={({ item: exercise }) => (
            <ExerciseAccordionEntry
              exercise={exercise}
              onPress={handleExerciseChange}
            />
          )}
        />
      </Accordion>
    </Card>
  );
};
