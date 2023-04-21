import { Star } from "@tamagui/lucide-icons";
import { useGetUser } from "api";
import { CachedImage } from "components";
import React from "react";
import { Pressable } from "react-native";
import { XStack, Text, YStack, useTheme, Stack } from "tamagui";
import { Exercise } from "types";

import { titleCase } from "../../../../utils/formatting";

interface Props {
  exercise: Exercise;
  onPress: (exercise: Exercise) => void;
}

const ExerciseAccordionEntryInternal = ({ exercise, onPress }: Props) => {
  const theme = useTheme();
  const { data: user } = useGetUser();

  const max = user?.maxes.find((max) => max.exercise === exercise.name);

  return (
    <Pressable onPress={() => onPress(exercise)}>
      <XStack alignItems="center" space={2} my={2} p={2}>
        <YStack>
          <Text w="100%" color="black" my="auto">
            {exercise.name}
          </Text>
          <Text w="100%" fontSize={12} color="black" my="auto">
            {Object.entries(exercise.muscleGroupStats)
              .map(([muscleGroup, value]) => {
                return `${value} ${titleCase(muscleGroup)} XP`;
              })
              .join("\n")}
          </Text>
        </YStack>

        {max && (
          <Star
            style={{ marginLeft: "auto", marginBottom: 5 }}
            size={25}
            color={theme.primary300.val}
          />
        )}

        {/*         <CachedImage
          style={{
            width: 60,
            height: 50,
            marginLeft: "auto",
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: max ? theme.primary300.val : theme.gray200.val,
          }}
          alt={`${exercise.name} image`}
          fileName={`${exercise.muscleGroupImageId}.png`}
        /> */}
      </XStack>
    </Pressable>
  );
};

export const ExerciseAccordionEntry = React.memo(
  ExerciseAccordionEntryInternal
);
