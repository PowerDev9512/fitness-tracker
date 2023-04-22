import { useMutation } from "@tanstack/react-query";
import { useStore } from "store";

import { queryClient } from "../apiProvider";
import { client } from "../client";
import { Mixpanel } from "utils";

type LoginRequest = {
  email: string;
  password: string;
};

type RawLoginResponse = {
  userId: number;
  token: string;
};

export function useLogin() {
  const { setUserId, setToken, userId } = useStore();

  return useMutation(
    async (request: LoginRequest) => {
      const { data } = await client.post<RawLoginResponse>(
        "/users/login",
        request
      );

      setUserId(data.userId);
      setToken(data.token);
    },
    {
      onSuccess() {
        Mixpanel.track("Logged In");
        queryClient.invalidateQueries(["user", userId]);
      },
    }
  );
}
