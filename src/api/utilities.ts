import axios, { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import { ApiError } from "types";
import { log } from "utils";

export function handleError(err: unknown) {
  if (axios.isAxiosError(err)) {
    const error = err as AxiosError<ApiError>;
    const errorMessage = error?.response?.data
      ? error.response.data.errors.join("\n")
      : error.message;

    log(errorMessage, "error");

    Toast.show({
      text1: "An error has occured",
      type: "error",
    });
  }
}
