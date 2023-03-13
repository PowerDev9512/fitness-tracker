import axios from "axios";

const local4 = "https://bc53-49-188-126-42.au.ngrok.io/";

export const client = axios.create({
  baseURL: local4,
});
