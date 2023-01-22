import axios from "axios";

const local = "https://b634-49-188-126-42.au.ngrok.io/";

export const client = axios.create({
  baseURL: local,
});
