import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "store";
import { Mixpanel } from "utils";

import { client } from "../client";

type LoginRequest = {
  email: string;
  password: string;
};

type RawLoginResponse = {
  userId: number;
  token: string;
};

export function useLogin() {
  const { setUserId, setToken, setViewedScreens, userId } = useStore();
  const queryClient = useQueryClient();

  return useMutation(
    async (request: LoginRequest) => {
      const { data } = await client.post<RawLoginResponse>(
        "/users/login",
        request
      );

      setUserId(data.userId);
      setToken(data.token);
      setViewedScreens("loggedInOnce", true);
    },
    {
      onSuccess() {
        Mixpanel.track("Logged In");
        queryClient.invalidateQueries(["user", { id: userId }]);
      },
    }
  );
}
