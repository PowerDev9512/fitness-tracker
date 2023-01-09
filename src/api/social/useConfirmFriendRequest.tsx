import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../apiProvider";
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

  return useMutation(
    async (request: ConfirmFriendRequestRequest) => {
      const { data } = await client.post<ConfirmFriendRequestResponse>(
        `/users/${user?.id}/friends/confirm`,
        request
      );
      return { friendIds: data.friendIds };
    },
    {
      onSuccess(response: ConfirmFriendRequestResponse) {
        if (user && response) {
          queryClient.setQueryData(["user", user.id], {
            ...user,
            friends: response.friendIds,
            friendRequests: user.friendRequests.filter(
              (id: number) =>
                id !== response.friendIds[response.friendIds.length - 1]
            ),
          });
          queryClient.invalidateQueries(["feed", user.id]);
        }
      },
    }
  );
}
