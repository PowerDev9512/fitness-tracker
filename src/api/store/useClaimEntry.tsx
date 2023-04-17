import { useMutation } from "@tanstack/react-query";
import { Reward, User } from "types";

import { queryClient } from "../apiProvider";
import { client } from "../client";
import { useGetUser } from "../user/useGetUser";

type ClaimEntryRequest = {
  reward: Reward;
};

type ClaimEntryResponse = {
  reward: Reward;
};

type ClaimEntryPayload = {
  reward: Reward;
};

export function useClaimEntry() {
  const { data: user } = useGetUser();

  return useMutation(
    async (rawRequest: ClaimEntryRequest) => {
      const payload: ClaimEntryPayload = {
        reward: rawRequest.reward,
      };

      const { data } = await client.post<ClaimEntryResponse>(
        `/users/${user?.id ?? -1}/recordPurchase`,
        payload
      );

      return { reward: data.reward };
    },
    {
      onSuccess(response) {
        if (user && response) {
          const newData: User = {
            ...user,
            inventory: [...user.inventory, response.reward],
          };

          queryClient.setQueryData(["user", user.id], newData);
        }
      },
    }
  );
}
