import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Message, User, Workout } from "types";

import { client } from "../client";
import { useGetUser } from "../user/useGetUser";

type GetFeedRawResponse = {
  messages: {
    workout: Workout;
    timestamp: string;
    user: User;
  }[];
};

type GetFeedResponse = Message[];

export function useGetFeed(): UseQueryResult<GetFeedResponse, unknown> {
  const { data: user } = useGetUser();

  return useQuery(
    ["feed", user?.id],
    async () => {
      if (!user) {
        return [];
      }

      const { data } = await client.get<GetFeedRawResponse>(
        `/users/${user?.id}/feed`
      );

      return data.messages.map(
        (message) =>
          ({
            workout: message.workout,
            date: message.timestamp,
            user: message.user,
          } as Message)
      );
    },
    {
      refetchInterval: 60,
    }
  );
}
