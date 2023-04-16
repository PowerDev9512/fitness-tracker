import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Exercise } from "types";

import { client } from "../client";
import { queryClient } from "../apiProvider";

type RawGetExercisesResponse = {
  exercises: Exercise[];
};

type GetExercisesResponse = Exercise[];

type GetExercisesParams = {
  retrieveImages: boolean;
};

export function useExercises({
  retrieveImages,
}: GetExercisesParams): UseQueryResult<GetExercisesResponse, unknown> {
  return useQuery({
    queryKey: ["exercises", retrieveImages ? "withImages" : "withoutImages"],
    queryFn: async () => {
      if (retrieveImages) {
        return []; // broken because the payload is like 300mb now lmfao
      }

      const { data } = await client.get<RawGetExercisesResponse>("/exercises", {
        params: {
          retrieveImages,
        },
      });

      return data.exercises;
    },
  });
}
