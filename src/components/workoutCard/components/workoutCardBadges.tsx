import { useNavigation } from "@react-navigation/native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "tamagui";
import { Workout } from "types";

import { useDeleteWorkout } from "../../../api/user/useDeleteWorkout";
import { useGetUser } from "../../../api/user/useGetUser";
import { Badge } from "../../badge";

interface Props {
  workout: Workout;
}

export const WorkoutCardBadges = ({ workout }: Props) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { data: user } = useGetUser();
  const { mutate: deleteWorkout, isLoading: deleting } = useDeleteWorkout();
  const isOldWorkout = workout.past || workout.completed;

  return (
    <>
      <Badge
        side="left"
        loading={deleting}
        onClick={() => {
          deleteWorkout({ userId: user?.id ?? -1, workoutId: workout.id });
        }}
      >
        <Icon name="backspace-sharp" size={30} color={theme.red.val} />
      </Badge>

      {isOldWorkout && workout.completed && (
        <Badge offset={35} side="right" background={false}>
          <Icon
            name="ios-checkmark-done-sharp"
            size={30}
            color={theme.green.val}
          />
        </Badge>
      )}

      {isOldWorkout && !workout.completed && (
        <Badge side="right" background={false}>
          <Icon name="ios-close-sharp" size={30} color={theme.red.val} />
        </Badge>
      )}

      <Badge
        side="right"
        background={false}
        onClick={() => {
          const workoutForCreate = {
            ...workout,
            id: 0,
            activities: workout.activities.map((activity) => {
              if (activity.type === "strength") {
                return {
                  ...activity,
                  reps: null,
                  sets: null,
                  weight: null,
                };
              } else if (activity.type === "cardio") {
                return {
                  ...activity,
                  distance: null,
                  duration: null,
                };
              }
            }),
          } as Workout;

          navigation.navigate(
            "Create" as never,
            { workout: workoutForCreate } as never
          );
        }}
      >
        <Icon name="arrow-redo" size={30} color={theme.primary300.val} />
      </Badge>
    </>
  );
};
