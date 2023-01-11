import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import * as React from "react";
import Toast from "react-native-toast-message";

import { log } from "../utils/helpers";

const onErrorHandler = (err: unknown) => {
  log(err, "error");

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

export default function APIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
