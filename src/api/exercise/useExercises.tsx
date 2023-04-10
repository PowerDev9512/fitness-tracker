import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Exercise } from "types";

import { client } from "../client";

type RawGetExercisesResponse = {
  exercises: Exercise[];
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
  return useQuery({
    enabled: shouldFetch,
    queryKey: ["exercises", retrieveImages],
    queryFn: async () => {
      const { data } = await client.get<RawGetExercisesResponse>("/exercises", {
        params: {
          retrieveImages,
        },
      });

      return data.exercises;
    },
  });
}
