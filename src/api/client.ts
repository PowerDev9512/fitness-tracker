import axios from "axios";
import { useStore } from "store";

export const url = "http://13.238.79.62/";

export const client = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(async (config) => {
  const { token } = useStore.getState();

  if (token) {
    config.headers.Authorization = `Bearer ${token.token}`;
  }

  return config;
});
