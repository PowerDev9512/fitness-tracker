import { Button, WorkoutCard } from "components";
import React from "react";
import { ScheduledWorkout } from "types";

interface Props {
  scheduledWorkout: ScheduledWorkout;
  onComplete: () => void;
}

export const ScheduledWorkoutCard = ({
  scheduledWorkout,
  onComplete,
}: Props) => {
  const footer = <Button onPress={() => onComplete()}>Complete Workout</Button>;

  return <WorkoutCard workout={scheduledWorkout} footer={footer} />;
};
