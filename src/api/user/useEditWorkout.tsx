import { useMutation } from "@tanstack/react-query";
import { Exercise, Max, Workout } from "types";

import { queryClient } from "../apiProvider";
import { client } from "../client";
import {
  ApiData,
  ApiWorkout,
  ApiWorkoutToWorkout,
  WorkoutToApiWorkout,
} from "../types";
import { useGetUser } from "./useGetUser";

type EditWorkoutRequest = {
  userId: number;
  workout: Workout;
};

type EditWorkoutPayload = {
  newData: Record<number, ApiData>;
  completed: boolean;
};

type EditWorkoutResponse = {
  workout: ApiWorkout;
  maxes: Max[];
};

export function useEditWorkout() {
  const { data: user } = useGetUser();

  return useMutation(
    async (rawRequest: EditWorkoutRequest) => {
      const workout = WorkoutToApiWorkout(rawRequest.workout, true);
      const payload: EditWorkoutPayload = {
        newData: workout.activities.reduce((acc, activity) => {
          acc[+activity.data.id] = activity.data;
          return acc;
        }, {} as Record<number, ApiData>),
        completed: workout.completed,
      };

      const { data } = await client.put<EditWorkoutResponse>(
        `/users/${rawRequest.userId}/workouts/${rawRequest.workout.id}`,
        payload
      );
      return {
        workout: ApiWorkoutToWorkout(data.workout, user?.maxes ?? []),
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
