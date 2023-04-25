import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useStore } from "../../store/store";
import { Reward } from "../../types/domain";
import { client } from "../client";

type RecordAchievementRequest = {
  userId: number;
  achievementId: number;
};

type RawRecordAchievementResponse = {
  rewards: Reward[];
};

export function useRecordAchievement() {
  const queryClient = useQueryClient();
  const { userId } = useStore();

  return useMutation(
    async (request: RecordAchievementRequest) => {
      const { data } = await client.post<RawRecordAchievementResponse>(
        `/Users/${request.userId}/RecordAchievement/${request.achievementId}`
      );
      return data.rewards;
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(["user", { id: userId }], { exact: false });
        queryClient.invalidateQueries(["userAchievements", { id: userId }], {
          exact: false,
        });
      },
    }
  );
}
