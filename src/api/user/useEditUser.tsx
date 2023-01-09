import { useMutation } from "@tanstack/react-query";
import { useStore } from "store";
import { Badge, Image, Title, User } from "types";

import { queryClient } from "../apiProvider";
import { client } from "../client";
import { useGetUser } from "./useGetUser";

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

export function useEditUser() {
  const { userId } = useStore();
  const { data: oldUser } = useGetUser();

  return useMutation(
    async (rawRequest: RawEditUserRequest) => {
      const boolFromStr = (str: string) => {
        if (str === "true") {
          return true;
        }
        return false;
      };

      const request = {
        ...rawRequest,
        darkMode: boolFromStr(rawRequest.darkMode),
      } as EditUserRequest;

      queryClient.setQueryData(["user", userId], {
        ...oldUser,
        weeklyWorkoutAmountGoal: request.weeklyWorkountAmountGoal,
        height: request.height,
        weight: request.weight,
        age: request.age,
        avatar: request.avatar,
        userSettings: {
          ...oldUser?.userSettings,
          weightUnit: request.weightUnit,
          measurementUnit: request.measurementUnit,
          darkMode: request.darkMode,
        },
      });

      await client.put<EditUserResponse>(
        `/users/${rawRequest.userId}`,
        request
      );
    },
    {
      onError: () => {
        queryClient.setQueryData(["user", userId], oldUser);
      },
    }
  );
}
