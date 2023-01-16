import axios from "axios";

const local = "https://08f3-49-188-126-42.au.ngrok.io/";

export const client = axios.create({
  baseURL: local,
});
