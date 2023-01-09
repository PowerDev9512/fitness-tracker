import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiError, User } from "types";
import { log } from "utils";

import { Toast } from "../components/toast/toast";
import { client } from "./client";
import { ApiUser, ApiUserToUser } from "./types";

export function handleError(err: unknown) {
  if (axios.isAxiosError(err)) {
    const error = err as AxiosError<ApiError>;
    const errorMessage = error?.response?.data
      ? error.response.data.errors.join("\n")
      : error.message;

    log(errorMessage, "error");

    Toast({
      title: "An error has occured",
      colorScheme: "error",
    });
  }
}

type RawGetUserResponse = {
  user: ApiUser;
};

export function updateUser(
  currentUser: User,
  setUser: (updatedUser: User) => void
) {
  client
    .get(`/users/${currentUser.id}`)
    .then((response: AxiosResponse<RawGetUserResponse>) => {
      setUser({
        ...ApiUserToUser(response.data.user),
      });
    })
    .catch((error) => {
      handleError(error);
    });
}
