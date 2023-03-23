import axios from "axios";

const local = "https://b23c-106-71-191-213.au.ngrok.io/";

export const client = axios.create({
  baseURL: local,
});
