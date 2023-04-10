import axios from "axios";
import { useStore } from "store";

const local = "https://5844-106-71-191-213.au.ngrok.io/";

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
