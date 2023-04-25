import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { UserAchievement } from "types";

import { client } from "../client";

type GetUserAchievementsResponse = UserAchievement[];

type GetUserAchievements = {
  userId: number;
};

export function useUserAchievements({
  userId,
}: GetUserAchievements): UseQueryResult<GetUserAchievementsResponse, unknown> {
  return useQuery(["userAchievements", { id: userId }], async () => {
    const { data } = await client.get<GetUserAchievementsResponse>(
      `Users/${userId}/Achievements`
    );
    return data;
  });
}
