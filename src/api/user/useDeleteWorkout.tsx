import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "store";
import { User } from "types";

import { client } from "../client";

type DeleteWorkoutRequest = {
  userId: number;
  workoutId: number;
};

export function useDeleteWorkout() {
  const { userId } = useStore();
  const queryClient = useQueryClient();

  return useMutation(
    async (rawRequest: DeleteWorkoutRequest) => {
      const { data } = await client.delete(
        `/users/${rawRequest.userId}/workouts/${rawRequest.workoutId}`
      );
      return data;
    },
    {
      onSuccess(data, variables, rawRequest) {
        queryClient.setQueryData(
          ["user", { id: userId }],
          (oldUser: User | undefined) => {
            if (!oldUser) {
              return;
            }

            return {
              ...oldUser,
              workouts: [
                ...oldUser.workouts.filter(
                  (workout) => workout.id !== variables.workoutId
                ),
              ],
            };
          }
        );
        queryClient.invalidateQueries(["user"], { exact: false });
        queryClient.invalidateQueries(["workoutData"], { exact: false });
        queryClient.invalidateQueries(["workoutNames"], { exact: false });
        queryClient.invalidateQueries(["userAchievements", { id: userId }]);
      },
    }
  );
}
