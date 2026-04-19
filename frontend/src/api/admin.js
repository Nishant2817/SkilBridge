import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

const getConfig = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// ======== USERS ========
export async function getAllUsers(token) {
  const { data } = await api.get("/users", getConfig(token));
  return data;
}

export async function deleteUser(id, token) {
  const { data } = await api.delete(`/users/${id}`, getConfig(token));
  return data;
}

// ======== GIGS ========
export async function getAllGigs(token) {
  const { data } = await api.get("/gigs", getConfig(token));
  return data;
}

export async function deleteGig(id, token) {
  const { data } = await api.delete(`/gigs/${id}`, getConfig(token));
  return data;
}

// ======== ORDERS ========
export async function getAllOrders(token) {
  const { data } = await api.get("/orders", getConfig(token));
  return data;
}

export async function deleteOrder(id, token) {
  const { data } = await api.delete(`/orders/${id}`, getConfig(token));
  return data;
}
