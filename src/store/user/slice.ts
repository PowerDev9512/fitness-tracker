import { log } from "utils";
import { StateCreator } from "zustand";

import { State } from "../store";

export interface UserSlice {
  userId: number | undefined;
  token: string | undefined;
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
  setToken: (token) => set({ token }),
  debug: () => log(get()),
});
