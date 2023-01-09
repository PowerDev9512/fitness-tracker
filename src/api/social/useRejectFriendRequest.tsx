import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../apiProvider";
import { client } from "../client";
import { useGetUser } from "../user/useGetUser";

type RejectFriendRequestRequest = {
  friendId: number;
};

type RejectFriendRequestResponse = {
  friendIds: number[];
};

export function useRejectFriendRequest() {
  const { data: user } = useGetUser();

  return useMutation(
    async (request: RejectFriendRequestRequest) => {
      const { data } = await client.post<RejectFriendRequestResponse>(
        `/users/${user?.id}/friends/deny`,
        request
      );
      return { friendIds: data.friendIds };
    },
    {
      onSuccess(response: RejectFriendRequestResponse) {
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
