import { API_URL } from "@env";
import axios from "axios";

const local = "https://2654-49-188-126-42.au.ngrok.io/";

export const client = axios.create({
  baseURL: local ?? API_URL,
});
