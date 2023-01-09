import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Exercise } from "types";

import { client } from "../client";
import { ApiExercise, ApiExerciseToExercise } from "../types";
import { useGetUser } from "../user/useGetUser";

type RawGetExercisesResponse = {
  exercises: ApiExercise[];
};

type GetExercisesResponse = Exercise[];

type GetExercisesParams = {
  retrieveImages: boolean;
  shouldFetch?: boolean;
};

export function useExercises({
  retrieveImages,
  shouldFetch = true,
}: GetExercisesParams): UseQueryResult<GetExercisesResponse, unknown> {
  const { data: user } = useGetUser();
  return useQuery({
    enabled: shouldFetch,
    queryKey: ["exercises", retrieveImages],
    queryFn: async () => {
      const { data } = await client.get<RawGetExercisesResponse>("/exercises", {
        params: {
          retrieveImages,
        },
      });

      return data.exercises.map((exercise) =>
        ApiExerciseToExercise(exercise, user?.maxes ?? [])
      );
    },
  });
}
