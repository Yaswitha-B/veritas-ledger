import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.API_URL
});

export const uploadRecord = (formData) =>
  API.post("/evidence/upload", formData);

export const verifyRecord = (formData) =>
  API.post("/evidence/verify", formData);