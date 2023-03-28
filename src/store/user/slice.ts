import { log } from "utils";
import { StateCreator } from "zustand";

import { State } from "../store";

interface JwtToken {
  token: string;
  expiresAt: Date;
}

export interface UserSlice {
  userId: number | undefined;
  token: JwtToken | undefined;
  setUserId: (userId: number | undefined) => void;
  setToken: (token: string | undefined) => void;
  debug: () => void;
}

export const createUserSlice: StateCreator<
  State,
  [["zustand/persist", unknown]],
  [],
  UserSlice
> = (set, get) => ({
  userId: undefined,
  token: undefined,
  setUserId: (userId) => set({ userId }),
  setToken: (token) => {
    if (!token) return set({ token: undefined });

    const expiresAt = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);
    return set({ token: { token, expiresAt } });
  },
  debug: () => log(get()),
});
