import { Star } from "@tamagui/lucide-icons";
import { Accordion, CachedImage, Card } from "components";
import { Pressable } from "react-native";
import { XStack, Text } from "tamagui";
import { Exercise } from "types";
import { titleCase } from "utils";

interface Props {
  exercise: Exercise;
  onPress: (exercise: Exercise) => void;
}

export const ExerciseAccordionEntry = ({ exercise, onPress }: Props) => {
  return (
    <Pressable onPress={() => onPress(exercise)}>
      <XStack alignItems="center" space={2} my={2} p={2}>
        <Text w="100%" color="black" my="auto">
          {exercise.name}
        </Text>
        {exercise.userHasMax && (
          <Star color="$primary500" size={25} style={{ marginLeft: "auto" }} />
        )}
        <CachedImage
          style={{ width: 60, height: 50, marginLeft: "auto" }}
          alt={`${exercise.name} image`}
          fileName={`${exercise.muscleGroupImageId}.png`}
        />
      </XStack>
    </Pressable>
  );
};
