import axios from "axios";
import { loadJson } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/constants";

// true -> everything is served from data.json + localStorage (no backend needed)
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  timeout: 15000,
  withCredentials: true, // send / receive the httpOnly auth cookie set by the backend
});

// attach the JWT to every request
client.interceptors.request.use((config) => {
  const token = loadJson(STORAGE_KEYS.token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const apiError = (err) =>
  err?.response?.data?.message ?? err?.message ?? "Something went wrong";

export default client;