import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "store";
import { User } from "types";

import { client } from "../client";
import { Mixpanel } from "utils";

type RegisterRequest = {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  buddyName: string;
  height: number;
  weight: number;
  weightUnit: "kilograms" | "pounds";
  measurementUnit: "metric" | "imperial";
  age: number;
  maxes: Record<string, { reps: number; weight: number }>;
};

type RegisterRawResponse = {
  user: User;
  token: string;
};

export function useRegister() {
  const { setUserId, setToken, userId } = useStore();
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  return useMutation(
    async (request: RegisterRequest) => {
      const updatedRequest = {
        ...request,
        maxes: Object.entries(request.maxes).map(([k, v]) => ({
          exercise: k,
          reps: v.reps,
          weight: v.weight,
        })),
      };
      const { data } = await client.post<RegisterRawResponse>(
        "/users/register",
        updatedRequest
      );
      setUserId(data.user.id);
      setToken(data.token);
      return data.user;
    },
    {
      onSuccess(response: User) {
        if (response) {
          Mixpanel.track("Registered");
          queryClient.setQueryData(["user", { id: userId }], response);
          navigation.reset({ index: 0, routes: [{ name: "Drawer" as never }] });
        }
      },
    }
  );
}
