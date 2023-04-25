import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useStore } from "store";
import { Message, User, Workout } from "types";

import { client } from "../client";

type GetFeedRawResponse = {
  messages: {
    workout: Workout;
    timestamp: string;
    user: User;
  }[];
};

type GetFeedResponse = Message[];

export function useGetFeed(): UseQueryResult<GetFeedResponse, unknown> {
  const { userId } = useStore();

  return useQuery(["feed"], async () => {
    if (!userId) {
      return [];
    }

    const { data } = await client.get<GetFeedRawResponse>(
      `/users/${userId}/feed`
    );

    return data.messages.map(
      (message) =>
        ({
          workout: message.workout,
          date: message.timestamp,
          user: message.user,
        } as Message)
    );
  });
}
