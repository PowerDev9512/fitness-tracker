import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useStore } from "store";
import { OtherUser } from "types";

import { client } from "../client";

type GetOtherUserRawResponse = {
  user: OtherUser;
};

type GetOtherUserResponse = OtherUser | null;

export function useGetOtherUser(
  otherUserName: string | null
): UseQueryResult<GetOtherUserResponse, unknown> {
  const { userId } = useStore();

  return useQuery(["otherUser", otherUserName], async () => {
    if (!userId || !otherUserName) {
      return null;
    }

    const { data } = await client.get<GetOtherUserRawResponse>(
      `/users/${userId}/otherUsers/${otherUserName}`
    );
    return data.user;
  });
}
