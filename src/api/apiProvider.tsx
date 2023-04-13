import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as React from "react";
import Toast from "react-native-toast-message";
import { useStore } from "store";

import { log } from "../utils/helpers";

const onErrorHandler = (err: unknown) => {
  log(err, "error");

  if (err instanceof AxiosError) {
    const { setUserId, setToken } = useStore.getState();
    if (err.response?.status === 401) {
      setUserId(undefined);
      setToken(undefined);
      queryClient.clear();
      return;
    }

    const data = err.response?.data;
    if (isApiError(data) && data.errors.length > 0) {
      const error = data.errors?.[0];
      const message = ErrorCodes?.[error.code];
      if (message) {
        Toast.show({
          text1: message.title,
          text2: message.description ?? "",
          type: "error",
        });
      }
    }
  }
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: onErrorHandler,
  }),
  mutationCache: new MutationCache({
    onError: onErrorHandler,
  }),
});

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const ErrorCodes: {
  [key: number]: { title: string; description?: string };
} = {
  1: {
    title: "The email address you have entered is not registered",
    description: "Please check your email address and try again",
  },
  2: {
    title: "The requested activity does not exist",
  },
  3: {
    title: "We've failed to load your exercises",
    description: "Please try again later",
  },
  4: {
    title: "An unknown error has occurred",
    description: "Please try again later",
  },
  5: {
    title: "The achievement you are trying to claim has already been claimed",
    description: "Please refresh the page",
  },
  6: {
    title: "The achievement you are trying to claim does not exist",
  },
  7: {
    title: "The achievement you are trying to claim is not available to you",
  },
  8: {
    title: "We've failed to claim the rewards for this achievement",
    description: "Please try again later",
  },
  9: {
    title: "The password you have entered is incorrect",
  },
  10: {
    title: "The username or email you have entered is already in use",
  },
  11: {
    title: "The username or email you have entered is already in use",
  },
  12: {
    title: "The username or email you have entered is already in use",
  },
  13: {
    title: "The friend you are interacting with does not exist",
  },
  14: {
    title: "The friend you are adding is already your friend",
  },
  15: {
    title: "The friend you are adding already has a pending request from you",
  },
  16: {
    title: "The friend you are deleting is not your friend",
  },
  17: {
    title: "The friend request you are interacting with does not exist",
  },
  18: {
    title: "An unknown error has occurred",
    description: "Please try again later",
  },
  19: {
    title: "The requested exercise does not exist",
  },
  20: {
    title: "The requested workout does not exist",
  },
};

export type ApiError = {
  errors: {
    message: string;
    code: keyof typeof ErrorCodes;
  }[];
};

export function isApiError(response: any): response is ApiError {
  return response.errors !== undefined;
}
