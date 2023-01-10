import { WorkoutCard } from "components";
import React from "react";
import { Button } from "tamagui";
import { ScheduledWorkout } from "types";

interface Props {
  scheduledWorkout: ScheduledWorkout;
  onComplete: () => void;
}

export function ScheduledWorkoutCard({ scheduledWorkout, onComplete }: Props) {
  const footer = <Button onPress={() => onComplete()}>Complete Workout</Button>;

  return <WorkoutCard workout={scheduledWorkout} footer={footer} />;
}
