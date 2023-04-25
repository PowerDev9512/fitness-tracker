import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "store";

import { User } from "../../types/domain";
import { client } from "../client";

type RejectFriendRequestRequest = {
  friendId: number;
};

type RejectFriendRequestResponse = {
  friendIds: number[];
};

export function useRejectFriendRequest() {
  const { userId } = useStore();
  const queryClient = useQueryClient();

  return useMutation(
    async (request: RejectFriendRequestRequest) => {
      const { data } = await client.post<RejectFriendRequestResponse>(
        `/users/${userId}/friends/deny`,
        request
      );
      return { friendIds: data.friendIds };
    },
    {
      onSuccess(response: RejectFriendRequestResponse) {
        queryClient.setQueryData(
          ["user", { id: userId }],
          (user: User | undefined) => {
            if (!user) {
              return;
            }

            return {
              ...user,
              friends: response.friendIds,
              friendRequests: user.friendRequests.filter(
                (id: number) =>
                  id !== response.friendIds[response.friendIds.length - 1]
              ),
            };
          }
        );
        queryClient.invalidateQueries(["feed"]);
      },
    }
  );
}
