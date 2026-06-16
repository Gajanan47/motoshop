import API from "./axios"

export const placeOrder = (data) => API.post("/orders", data)

export const fetchOrders = () => API.get("/orders")

export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}/status`, { status })