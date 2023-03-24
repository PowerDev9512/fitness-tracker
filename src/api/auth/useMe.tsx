import { useQuery } from "@tanstack/react-query";
import { useStore } from "store";

import { queryClient } from "../apiProvider";
import { client } from "../client";

type MeResponse = {
  value: {
    token: string;
  };
};

export function useMe() {
  const { setToken, userId } = useStore();

  return useQuery(
    ["user", userId],
    async () => {
      const { data } = await client.get<MeResponse>("/users/me");
      setToken(data.value.token);
    }
  );
}
