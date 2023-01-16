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

const onErrorHandler = (err: unknown) => {
  log(err, "error");

  if (err instanceof AxiosError) {
    const data = err.response?.data;
    if (isApiError(data)) {
      if (data.length === 1) {
        Toast.show({
          text1: ErrorCodes[data[0].code],
          type: "error",
        });
      } else {
        Toast.show({
          text1: "An error has occured",
          type: "error",
          text2: "Please try again shortly!",
        });
      }
    }
  }

  Toast.show({
    text1: "An error has occured",
    type: "error",
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
