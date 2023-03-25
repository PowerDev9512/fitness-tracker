import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useStore } from "store";
import { OtherUser } from "types";

import { client } from "../client";

type GetOtherUserRawResponse = {
  user: OtherUser;
};

type GetOtherUserResponse = OtherUser | null;

export function useGetOtherUser(
  otherUserId: number
): UseQueryResult<GetOtherUserResponse, unknown> {
  const { userId } = useStore();

  return useQuery(["otherUser", otherUserId], async () => {
    const { data } = await client.get<GetOtherUserRawResponse>(`/users/${userId}/otherUsers/${otherUserId}`);
    return data.user;
  });
}
