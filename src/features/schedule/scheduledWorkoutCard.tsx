import { Button, WorkoutCard } from "components";
import React from "react";
import { ScheduledWorkout } from "types";

interface Props {
  scheduledWorkout: ScheduledWorkout;
  onComplete: () => void;
  isFocused: boolean;
}

export const ScheduledWorkoutCard = ({
  scheduledWorkout,
  onComplete,
  isFocused,
}: Props) => {
  const footer = <Button onPress={onComplete}>Complete Workout</Button>;

  return (
    <WorkoutCard
      workout={scheduledWorkout}
      footer={footer}
      isFocused={isFocused}
    />
  );
};
