import { useNavigation } from "@react-navigation/native";
import { ChevronRight, Edit } from "@tamagui/lucide-icons";
import { useGetUser } from "api";
import React, { useState } from "react";
import { Pressable } from "react-native";
import { Stack, Text, XStack } from "tamagui";
import { StrengthActivity, Workout } from "types";
import { getWeightFormatter } from "utils";

import { IconButton } from "../../iconButton";
import { StrengthModal } from "./strengthModal";

interface Props {
  activity: StrengthActivity;
  workout: Workout;
}

export const StrengthRow = ({ activity, workout }: Props) => {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const { data: user } = useGetUser();
  const weightFormatter = getWeightFormatter(user);

  return (
    <Stack>
      <StrengthModal
        activity={activity}
        workout={workout}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <Pressable
        onPress={() =>
          navigation.navigate(
            "Activity" as never,
            { mainActivityId: activity.id } as never
          )
        }
      >
        <XStack alignContent="center" mb="$2" alignItems="center">
          <Text mr="$2" fontSize={16} fontWeight="bold">
            Goal
          </Text>
          <Text my="auto">
            {weightFormatter(
              `${activity.targetSets} x ${activity.targetReps} at ${activity.targetWeight}`,
              false
            )}
          </Text>
          <Stack ml="auto">
            <ChevronRight />
          </Stack>
        </XStack>
      </Pressable>

      <XStack mt="$-2" alignContent="center" alignItems="center">
        <Text mr="$2" fontSize={16} fontWeight="bold">
          Result
        </Text>
        <Text>
          {activity.sets && activity.reps && activity.weight
            ? weightFormatter(
                `${activity.sets} x ${activity.reps} at ${activity.weight}`,
                false
              )
            : "Uncompleted"}
        </Text>

        {!workout.completed && !workout.past && (
          <IconButton
            icon="ios-pencil"
            ml="$4"
            size={20}
            color="$gray700"
            onPress={() => setIsOpen(true)}
          />
        )}
      </XStack>
    </Stack>
  );
};
