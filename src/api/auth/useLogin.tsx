import { useMutation } from "@tanstack/react-query";
import { useStore } from "store";

import { queryClient } from "../apiProvider";
import { client } from "../client";

type LoginRequest = {
  email: string;
  password: string;
};

type RawLoginResponse = {
  value: {
    userId: number;
  };
};

export function useLogin() {
  const { setUserId, userId } = useStore();

  return useMutation(
    async (request: LoginRequest) => {
      const { data } = await client.post<RawLoginResponse>(
        "/users/login",
        request
      );
      setUserId(data.value.userId);
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(["user", userId]);
      },
    }
  );
}
