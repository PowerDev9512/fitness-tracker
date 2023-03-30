import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useStore } from "store";
import { User } from "types";

import { client } from "../client";
import { ApiUser, ApiUserToUser } from "../types";

type GetUserRawResponse = {
  user: ApiUser;
};

type GetUserResponse = User | null;

export function useGetUser(): UseQueryResult<GetUserResponse, unknown> {
  const { userId, setUserId } = useStore();

  return useQuery(["user", userId], async () => {
    if (!userId || userId < 0) {
      return undefined;
    }

    const response = await client.get<GetUserRawResponse>(`/users/${userId}`);
    setUserId(response.data.user.id);
    return ApiUserToUser(response.data.user);
  });
}