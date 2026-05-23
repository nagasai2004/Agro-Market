import { http } from "./http";

export async function registerUser(payload) {
  const { data } = await http.post("/auth/register", payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await http.post("/auth/login", payload);
  return data;
}

