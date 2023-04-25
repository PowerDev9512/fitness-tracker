import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "store";
import { User } from "types";

import { client } from "../client";
import { useGetUser } from "../user/useGetUser";

type ConfirmFriendRequestRequest = {
  friendId: number;
};

type ConfirmFriendRequestResponse = {
  friendIds: number[];
};

export function useConfirmFriendRequest() {
  const { data: user } = useGetUser();
  const queryClient = useQueryClient();
  const { userId } = useStore();

  return useMutation(
    async (request: ConfirmFriendRequestRequest) => {
      const { data } = await client.post<ConfirmFriendRequestResponse>(
        `/users/${user?.id}/friends/confirm`,
        request
      );
      return { friendIds: data.friendIds };
    },
    {
      onSuccess(response) {
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
