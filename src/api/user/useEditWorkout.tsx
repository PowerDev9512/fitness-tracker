import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "store";
import { Activity, Exercise, Max, User, Workout } from "types";

import { useGetUser } from "./useGetUser";
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
  const queryClient = useQueryClient();
  const { userId } = useStore();

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
      mutationKey: ["editWorkout"],
      onSuccess(response) {
        if (user) {
          queryClient.setQueryData(
            ["user", { id: userId }],
            (oldUser: User | undefined) => {
              if (!oldUser) {
                return;
              }

              return {
                ...oldUser,
                maxes: response.maxes,
                workouts: oldUser.workouts.map((workout) => {
                  if (workout.id === response.workout.id) {
                    return response.workout;
                  }
                  return workout;
                }),
              };
            }
          );

          queryClient.setQueryData(
            ["exercises"],
            (exercises: Exercise[] | undefined) => {
              if (!exercises) {
                return [];
              }

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

          queryClient.invalidateQueries(["workoutData"], { exact: false });
          queryClient.invalidateQueries(["userAchievements"], { exact: false });
        }
      },
    }
  );
}
