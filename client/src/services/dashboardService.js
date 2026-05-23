import { http } from "./http";

export async function getConsumerDashboard() {
  const { data } = await http.get("/dashboard/consumer");
  return data;
}

export async function getFarmerDashboard() {
  const { data } = await http.get("/dashboard/farmer");
  return data;
}
