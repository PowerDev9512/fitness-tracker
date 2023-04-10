import { useMutation } from "@tanstack/react-query";
import { Activity, ScheduledWorkout, Workout } from "types";

import { useGetUser } from "./useGetUser";
import { queryClient } from "../apiProvider";
import { client } from "../client";
import { log } from "utils";

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
  const { data: user } = useGetUser();

  return useMutation(
    async (rawRequest: AddWorkoutRequest) => {
      const workout = rawRequest.workout;

      log(workout);

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

      return { workouts: data.workout };
    },
    {
      onSuccess(response) {
        if (user && response) {
          const newData = {
            ...user,
            workouts: [...user.workouts, response.workouts],
          };

          queryClient.setQueryData(["user", user.id], newData);
          queryClient.invalidateQueries(["workoutData", user.id]);
          queryClient.invalidateQueries(["userAchievements"]);
        }
      },
    }
  );
}
