import axios from "axios";
import { useStore } from "store";

type MeResponse = {
  value: {
    token: string;
  };
};

const local = "http://13.238.79.62/";

const refreshToken = async (): Promise<string> => {
  try {
    return (await client.get<MeResponse>("/users/me")).data.value.token;
  } catch (error) {
    throw error;
  }
};

export const client = axios.create({
  baseURL: local,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + useStore.getState().token ?? "",
  },
});

client.interceptors.request.use(async (config) => {
  const { token, setToken } = useStore.getState();

  if (token && new Date() > new Date(token.expiresAt)) {
    const newToken = await refreshToken();
    setToken(newToken);
  }

  config.headers.Authorization = `Bearer ${token?.token}`;
  return config;
});
