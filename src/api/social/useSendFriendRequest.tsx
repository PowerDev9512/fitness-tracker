import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../apiProvider";
import { client } from "../client";
import { useGetUser } from "../user/useGetUser";

type AddFriendRequest = {
  friendId: number;
};

type AddFriendResponse = {
  friendIds: number[];
};

export function useSendFriendRequest() {
  const { data: user } = useGetUser();

  return useMutation(
    async (request: AddFriendRequest) => {
      const { data } = await client.post<AddFriendResponse>(
        `/users/${user?.id}/friends`,
        request
      );
      return { friendIds: data.friendIds };
    },
    {
      onSuccess(response: AddFriendResponse) {
        if (user && response) {
          queryClient.setQueryData(["user", user.id], {
            ...user,
            friends: response.friendIds,
          });
          queryClient.invalidateQueries(["feed", user.id]);
        }
      },
    }
  );
}
