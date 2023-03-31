import axios from "axios";
import { useStore } from "store";

interface MeResponse {
  token: string;
}

const local = "http://13.238.79.62/";

const refreshToken = async (): Promise<string> => {
  try {
    const response = (await client.get<MeResponse>("/users/me")).data;
    return response.token;
  } catch (error) {
    throw error;
  }
};

axios.interceptors.request.use(async (config) => {
  const { token, setToken } = useStore.getState();

  let tempToken = token?.token;

  if (token && new Date() > token.expiresAt) {
    const newToken = await refreshToken();
    setToken(newToken);
    tempToken = newToken;
  }

  config.headers.Authorization = `Bearer ${tempToken}`;
  return config;
});

export const client = axios.create({
  baseURL: local,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + useStore.getState().token?.token ?? "",
  },
});
