import { apiClient } from "./api_client";

export async function hashFile(file) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiClient.post("/hash", form);
  return data;
}

export async function hashText(text) {
  const { data } = await apiClient.post("/hash-text", { text });
  return data;
}

export async function verifySignature(hash, signature) {
  const { data } = await apiClient.post("/verify-signature", { hash, signature });
  return data.valid === true;
}