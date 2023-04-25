import { useIsMutating, useQueryClient } from "@tanstack/react-query";
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
  const currentEdits = useIsMutating({ mutationKey: ["editWorkout"] });
  const currentCreates = useIsMutating({ mutationKey: ["addWorkout"] });

  const footer = (
    <Button
      isLoading={currentEdits > 0 || currentCreates > 0}
      onPress={onComplete}
    >
      Complete Workout
    </Button>
  );

  return (
    <WorkoutCard
      workout={scheduledWorkout}
      footer={footer}
      isFocused={isFocused}
    />
  );
};
