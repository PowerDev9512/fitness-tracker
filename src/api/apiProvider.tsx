import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as React from "react";
import Toast from "react-native-toast-message";

import { log } from "../utils/helpers";
import { ErrorCodes, isApiError } from "./types";
import { useStore } from "store";

const onErrorHandler = (err: unknown) => {
  log(err, "error");

  if (err instanceof AxiosError) {
    const { setUserId, setToken } = useStore();
    if (err.response?.status === 401) {
      setUserId(undefined);
      setToken(undefined);
      queryClient.clear();
      return;
    }

    const data = err.response?.data;
    if (isApiError(data) && data.errors.length > 0) {
      Toast.show({
        text1: ErrorCodes[data.errors[0].code],
        type: "error",
      });
      return;
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
