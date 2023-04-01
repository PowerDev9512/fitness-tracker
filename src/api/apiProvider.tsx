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

import { ErrorCodes, isApiError } from "./types";
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
        return;
      }
    }
  }

  Toast.show({
    type: "error",
    text1: "An error has occured",
    text2: "Please try again shortly!",
  });
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
