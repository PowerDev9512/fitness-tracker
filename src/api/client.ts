import axios from "axios";
import { useStore } from "store";

const local = "http://13.238.79.62/";

export const client = axios.create({
  baseURL: local,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(async (config) => {
  const { token } = useStore.getState();

  if (!token) {
    return config;
  }

  config.headers.Authorization = `Bearer ${token.token}`;
  return config;
});
