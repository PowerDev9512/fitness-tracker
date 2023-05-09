import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "store";
import { Badge, Image, Title, User } from "types";

import { client } from "../client";

export type RawEditUserRequest = {
  userId: number;
  weightUnit: "pounds" | "kilograms";
  measurementUnit: "metric" | "imperial";
  darkMode: "true" | "false";
  username: string;
  email: string;
  weeklyWorkountAmountGoal: number;
  height: number;
  weight: number;
  age: number;
  avatar: Image | null;
  title: Title | null;
  badge: Badge | null;
};

type EditUserRequest = {
  weightUnit: "pounds" | "kilograms";
  measurementUnit: "metric" | "imperial";
  username: string;
  weeklyWorkountAmountGoal: number;
  height: number;
  weight: number;
  age: number;
  darkMode: boolean;
  avatar: Image | null;
};

type EditUserResponse = {
  user: User;
};

const boolFromStr = (str: string) => {
  if (str === "true") {
    return true;
  }
  return false;
};

export function useEditUser() {
  const { userId } = useStore();
  const queryClient = useQueryClient();

  const oldUser = queryClient.getQueryData<User>(["user", { id: userId }]);
  if (!oldUser) {
    throw new Error("User not found");
  }

  return useMutation(
    async (rawRequest: RawEditUserRequest) => {
      const request = {
        ...rawRequest,
        darkMode: boolFromStr(rawRequest.darkMode),
      } as EditUserRequest;

      queryClient.setQueryData(["user", { id: userId }], () => ({
        ...oldUser,
        userSettings: {
          ...oldUser?.userSettings,
          darkMode: request.darkMode,
        },
      }));

      const { data } = await client.put<EditUserResponse>(
        `/users/${rawRequest.userId}`,
        request
      );

      return {
        user: {
          ...oldUser,
          ...data.user,
        },
      };
    },
    {
      onError: () => {
        queryClient.setQueryData(["user", { id: userId }], () => ({
          ...oldUser,
        }));
      },
      onSuccess: (response) => {
        queryClient.setQueryData(["user", { id: userId }], () => ({
          ...oldUser,
          ...response.user,
        }));
      },
    }
  );
}
