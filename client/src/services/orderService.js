import { http } from "./http";

export async function updateOrderStatus(orderId, status) {
  const { data } = await http.patch(`/orders/${orderId}/status`, { status });
  return data;
}

