import axios from "axios";

export const API_CLIENT = axios.create({
  baseURL: `${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api`,
});

API_CLIENT.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);
