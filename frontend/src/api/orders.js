import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/orders",
});

/**
 * POST /api/orders
 * Buyer places gig request natively sending purely target ID. Price computed safely natively in SQL.
 */
export async function createOrder(gigId, token) {
  try {
    const { data } = await api.post("/", { gigId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to finalize gig order.");
  }
}

/**
 * GET /api/orders/buyer
 */
export async function getBuyerOrders(token) {
  try {
    const { data } = await api.get("/buyer", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to pull buyer history.");
  }
}

/**
 * GET /api/orders/seller
 */
export async function getSellerOrders(token) {
  try {
    const { data } = await api.get("/seller", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to pull merchant transaction queue.");
  }
}
