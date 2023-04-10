import { useMutation } from "@tanstack/react-query";
import { Activity, Exercise, Max, Workout } from "types";

import { useGetUser } from "./useGetUser";
import { queryClient } from "../apiProvider";
import { client } from "../client";

type EditWorkoutRequest = {
  userId: number;
  workout: Workout;
};

type EditWorkoutPayload = {
  activities: Record<number, Activity>;
  completed: boolean;
};

type EditWorkoutResponse = {
  workout: Workout;
  maxes: Max[];
};

export function useEditWorkout() {
  const { data: user } = useGetUser();

  return useMutation(
    async (rawRequest: EditWorkoutRequest) => {
      const workout = rawRequest.workout;
      const payload: EditWorkoutPayload = {
        activities: workout.activities.reduce((acc, activity) => {
          acc[+activity.id] = activity;
          return acc;
        }, {} as Record<number, Activity>),
        completed: workout.completed,
      };

      const { data } = await client.put<EditWorkoutResponse>(
        `/users/${rawRequest.userId}/workouts/${rawRequest.workout.id}`,
        payload
      );

      return {
        workout: data.workout,
        maxes: data.maxes,
      };
    },
    {
      onSuccess(response) {
        if (user && response) {
          queryClient.setQueryData(["user", user.id], {
            ...user,
            maxes: response.maxes,
            workouts: user.workouts.map((workout) => {
              if (workout.id === response.workout.id) {
                return response.workout;
              }
              return workout;
            }),
          });

          queryClient.setQueryData(
            ["exercises"],
            (exercises: Exercise[] | undefined) => {
              if (!exercises) return;
              return exercises.map((exercise) => {
                const matchingMax = response.maxes.find(
                  (max) => max.exercise === exercise.name
                );
                if (matchingMax) {
                  return { ...exercise, userHasMax: true };
                }
                return exercise;
              });
            }
          );

          queryClient.invalidateQueries(["workoutData"]);
          queryClient.invalidateQueries(["userAchievements"]);
        }
      },
    }
  );
}
