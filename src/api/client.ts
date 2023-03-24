import axios from "axios";
import { useStore } from "store";

const local = "http://13.238.79.62/";

export const client = axios.create({
  baseURL: local,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + useStore.getState().token ?? "",
  },
});
