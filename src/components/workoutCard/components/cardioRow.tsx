import { useNavigation } from "@react-navigation/native";
import { ChevronRight, Edit } from "@tamagui/lucide-icons";
import { useGetUser } from "api";
import React, { useState } from "react";
import { Pressable } from "react-native";
import { Stack, Text, XStack } from "tamagui";
import { CardioActivity, Workout } from "types";
import { getDistanceFormatter } from "utils";

import { IconButton } from "../../iconButton";
import { CardioModal } from "./cardioModal";

interface Props {
  activity: CardioActivity;
  workout: Workout;
}

export const CardioRow = ({ activity, workout }: Props) => {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const { data: user } = useGetUser();
  const distanceFormatter = getDistanceFormatter(user);

  return (
    <>
      <CardioModal
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
            {distanceFormatter(
              `${activity.targetDistance} in ${activity.targetDuration}`,
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
          {activity.distance || activity.duration
            ? distanceFormatter(
                `${activity.distance} in ${activity.duration}`,
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
