import axios from "axios";

const local = "http://13.238.79.62/";

export const client = axios.create({
  baseURL: local,
});
