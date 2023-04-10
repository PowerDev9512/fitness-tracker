import { Star } from "@tamagui/lucide-icons";
import { useGetUser } from "api";
import { CachedImage } from "components";
import { Pressable } from "react-native";
import { XStack, Text } from "tamagui";
import { Exercise } from "types";

interface Props {
  exercise: Exercise;
  onPress: (exercise: Exercise) => void;
}

export const ExerciseAccordionEntry = ({ exercise, onPress }: Props) => {
  const { data: user } = useGetUser();

  const max = user?.maxes.find((max) => max.exercise === exercise.name);

  return (
    <Pressable onPress={() => onPress(exercise)}>
      <XStack alignItems="center" space={2} my={2} p={2}>
        <Text w="100%" color="black" my="auto">
          {exercise.name}
        </Text>
        {max && (
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
