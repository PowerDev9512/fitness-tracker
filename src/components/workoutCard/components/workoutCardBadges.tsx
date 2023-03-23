import React from "react";

import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "tamagui";
import { Workout } from "types";
import { Badge } from "../../badge";

interface Props {
  workout: Workout;
}

export const WorkoutCardBadges = ({ workout }: Props) => {
  const theme = useTheme();
  const isOldWorkout = workout.past || workout.completed;

  if (!isOldWorkout) {
    return null;
  }

  return (
      <>
        {workout.completed && (
          <Badge side="right" background={false}>
            <Icon
              name="ios-checkmark-sharp"
              size={30}
              color={theme.green.val}
            />
          </Badge>
        )}

        {!workout.completed && (
          <Badge side="right" background={false}>
            <Icon name="ios-close-sharp" size={30} color={theme.red.val} />
          </Badge>
        )}
      </>
    );
};
