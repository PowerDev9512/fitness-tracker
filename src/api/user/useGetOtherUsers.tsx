import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useStore } from "store";
import { OtherUser } from "types";

import { client } from "../client";

type GetOtherUserRawResponse = {
  users: OtherUser[];
};

type GetOtherUserResponse = OtherUser[];

export function useGetOtherUsers(
  otherUsers: number[] | string[]
): UseQueryResult<GetOtherUserResponse, unknown> {
  const { userId } = useStore();

  return useQuery(["otherUsers", { ids: otherUsers }], async () => {
    if (otherUsers.length === 0) {
      return [];
    }

    const otherUsersString = otherUsers.join(",");
    const searchType = typeof otherUsers[0] === "string" ? "username" : "id";

    const { data } = await client.get<GetOtherUserRawResponse>(
      `/users/${userId}/otherUsers`,
      {
        params: {
          otherUsers: otherUsersString,
          searchType,
        },
      }
    );

    return data.users;
  });
}
