import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "store";
import { User } from "types";

import { client } from "../client";

type AddFriendRequest = {
  friendId: number;
};

type AddFriendResponse = {
  friendIds: number[];
};

export function useSendFriendRequest() {
  const { userId } = useStore();
  const queryClient = useQueryClient();

  return useMutation(
    async (request: AddFriendRequest) => {
      const { data } = await client.post<AddFriendResponse>(
        `/users/${userId}/friends`,
        request
      );
      return { friendIds: data.friendIds };
    },
    {
      onSuccess(response: AddFriendResponse) {
        queryClient.setQueryData(
          ["user", { id: userId }],
          (user: User | undefined) => {
            if (!user) {
              return;
            }

            return {
              ...user,
              friends: response.friendIds,
            };
          }
        );
        queryClient.invalidateQueries(["feed"]);
      },
    }
  );
}
