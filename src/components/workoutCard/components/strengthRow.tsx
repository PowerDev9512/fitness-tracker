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
    <>
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
        <XStack>
          <Text fontSize={16} fontWeight="bold">
            {" "}
            Goal{" "}
          </Text>
          <Text my="auto">
            {weightFormatter(
              `${activity.targetSets} x ${activity.targetReps} at ${activity.targetWeight}`,
              false
            )}
          </Text>
          <Stack ml="auto" mt={2}>
            <ChevronRight />
          </Stack>
        </XStack>
      </Pressable>

      <XStack>
        <Text fontSize={16} fontWeight="bold">
          {" "}
          Result{" "}
        </Text>
        <Text my="auto">
          {activity.sets && activity.reps && activity.weight
            ? weightFormatter(
                `${activity.sets} x ${activity.reps} at ${activity.weight}`,
                false
              )
            : "Uncompleted"}
        </Text>

        {!workout.completed && !workout.past && (
          <IconButton icon={<Edit />} onPress={() => setIsOpen(true)} />
        )}
      </XStack>
    </>
  );
};
