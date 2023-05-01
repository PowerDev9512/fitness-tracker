import { log } from "utils";
import { StateCreator } from "zustand";

import { State } from "../store";

export interface JwtToken {
  token: string;
  expiresAt: Date;
}

export interface ViewedScreens {
  messageOne: boolean;
  messageTwo: boolean;
  loggedInOnce: boolean;
}

export interface UserSlice {
  userId: number | undefined;
  token: JwtToken | undefined;
  viewedScreens: ViewedScreens;
  setUserId: (userId: number | undefined) => void;
  setToken: (token: string | undefined) => void;
  setViewedScreens: (key: keyof ViewedScreens, value: boolean) => void;
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
  viewedScreens: {
    messageOne: false,
    messageTwo: false,
    loggedInOnce: false,
  },
  setViewedScreens: (key, value) =>
    set((state) => ({
      viewedScreens: { ...state.viewedScreens, [key]: value },
    })),
  setUserId: (userId) => set({ userId }),
  setToken: (token) => {
    if (!token) return set({ token: undefined });

    const expiresAt = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);
    return set({ token: { token, expiresAt } });
  },
  debug: () => log(get()),
});
