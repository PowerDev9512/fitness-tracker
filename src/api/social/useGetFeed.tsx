import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Message } from "types";

import { client } from "../client";
import { ApiUser, ApiUserToUser } from "../types";
import { useGetUser } from "../user/useGetUser";

type GetFeedRawResponse = {
  messages: {
    text: string;
    date: string;
    user: ApiUser;
  }[];
};

type GetFeedResponse = Message[];

export function useGetFeed(): UseQueryResult<GetFeedResponse, unknown> {
  const { data: user } = useGetUser();

  return useQuery(["feed", user?.id], async () => {
    const { data } = await client.get<GetFeedRawResponse>(
      `/users/${user?.id}/feed`
    );
    return data.messages.map(
      (message) =>
        ({
          text: message.text,
          date: message.date,
          user: ApiUserToUser(message.user),
        } as Message)
    );
  });
}
