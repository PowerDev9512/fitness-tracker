import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Activity, ScheduledWorkout, User, Workout } from "types";

import { useStore } from "../../store/store";
import { client } from "../client";

type AddWorkoutRequest = {
  userId: number;
  workout: ScheduledWorkout;
};

type AddWorkoutResponse = {
  workout: Workout;
};

type ActivityDto = Activity & { exerciseId: number };

type AddWorkoutPayload = {
  name: string;
  activities: ActivityDto[];
  completed: boolean;
  past: boolean;
  time: string;
};

export function useAddWorkout() {
  const { userId } = useStore();
  const queryClient = useQueryClient();

  return useMutation(
    async (rawRequest: AddWorkoutRequest) => {
      const workout = rawRequest.workout;

      const payload: AddWorkoutPayload = {
        name: workout.name,
        activities: workout.activities.map((activity) => ({
          ...activity,
          exerciseId: activity.exercise.id,
        })),
        completed: workout.completed,
        past: workout.past,
        time: workout.time,
      };

      const { data } = await client.post<AddWorkoutResponse>(
        `/users/${rawRequest.userId}/workouts`,
        payload
      );

      return { workout: data.workout };
    },
    {
      mutationKey: ["addWorkout"],
      onSuccess(response) {
        queryClient.invalidateQueries(["userAchievements"], { exact: false });
        queryClient.invalidateQueries(["workoutData"], { exact: false });
        queryClient.setQueryData(
          ["user", { id: userId }],
          (oldUser: User | undefined) => {
            if (!oldUser) {
              return;
            }

            return {
              ...oldUser,
              workouts: [...oldUser.workouts, response.workout],
            };
          }
        );
        queryClient.invalidateQueries(["user"], { exact: false });
      },
    }
  );
}
