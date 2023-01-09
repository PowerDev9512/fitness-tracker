import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { User } from "types";

import { client } from "../client";
import { ApiUser, ApiUserToUser } from "../types";

type GetUsersRawResponse = {
  users: ApiUser[];
};

type GetUsersResponse = User[];

export function useGetUsers(
  userIds: number[] = []
): UseQueryResult<GetUsersResponse, unknown> {
  return useQuery(["users"], async () => {
    const { data } = await client.get<GetUsersRawResponse>(
      `/admin/getAllUsers`,
      {
        params: {
          ids: userIds,
        },
      }
    );

    return data.users.map(ApiUserToUser);
  });
}
