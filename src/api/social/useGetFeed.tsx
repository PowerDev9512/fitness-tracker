import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Message } from "types";

import { client } from "../client";
import { ApiUser, ApiUserToUser, ApiWorkout, ApiWorkoutToWorkout } from "../types";
import { useGetUser } from "../user/useGetUser";

type GetFeedRawResponse = {
  messages: {
    workout: ApiWorkout;
    timestamp: string;
    user: ApiUser;
  }[];
};

type GetFeedResponse = Message[];

export function useGetFeed(): UseQueryResult<GetFeedResponse, unknown> {
  const { data: user } = useGetUser();

  return useQuery(["feed", user?.id], async () => {
    if (!user) {
      return [];
    }

    const { data } = await client.get<GetFeedRawResponse>(
      `/users/${user?.id}/feed`
    );

    return data.messages.map(
      (message) =>
        ({
          workout: ApiWorkoutToWorkout(message.workout, user?.maxes),
          date: message.timestamp,
          user: ApiUserToUser(message.user),
        } as Message)
    );
  });
}
