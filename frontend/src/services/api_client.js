import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  console.error("[veritas] VITE_API_BASE_URL is not set — copy .env.example to .env");
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
});