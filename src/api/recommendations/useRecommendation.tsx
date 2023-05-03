import { useMutation } from "@tanstack/react-query";

import { Workout } from "../../types/domain";
import { client } from "../client";

interface RecommendationRequest {
  muscleGroups: string[];
  equipment: string[];
  userId: number;
}

type RecommendationResponse = Workout;

const useRecommendationBody = async (request: RecommendationRequest) => {
  const { data } = await client.post<RecommendationResponse>(
    "/Recommendations",
    request
  );

  return data;
};

export const useRecommendation = () => {
  return useMutation(useRecommendationBody);
};
