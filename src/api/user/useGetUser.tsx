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

  return useQuery(
    ["user", { id: userId ?? -1 }],
    async () => {
      if (!userId) {
        throw new Error("No user id provided");
      }

      const response = await client.get<GetUserRawResponse>(
        `/users/${userId ?? -1}`
      );

      return response.data.user;
    },
    {
      onSuccess: (data) => {
        if (data && !userId) {
          setUserId(data.id);
        }

        if (!data && userId) {
          setUserId(undefined);
        }
      },
      onError: () => {
        setUserId(undefined);
      },
    }
  );
}
