import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useStore } from "store";
import { User } from "types";

import { client } from "../client";

type GetUserRawResponse = {
  user: User;
};

type GetUserResponse = User | null;

export function useGetUser(): UseQueryResult<GetUserResponse, unknown> {
  const { userId, setUserId } = useStore();

  return useQuery(["user", userId ?? -1], async () => {
    if (userId && userId >= 0) {
      const response = await client.get<GetUserRawResponse>(`/users/${userId}`);
      setUserId(response.data.user.id);
      return response.data.user;
    }
  });
}
