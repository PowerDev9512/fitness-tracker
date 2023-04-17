import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { StoreEntry } from "types";

import { client } from "../client";

type GetStoreResponse = StoreEntry[];

export function useStoreEntries(): UseQueryResult<GetStoreResponse, unknown> {
  return useQuery(["storeEntries"], async () => {
    const { data } = await client.get<GetStoreResponse>("/store");
    return data;
  });
}
