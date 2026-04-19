import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/payment",
});

/**
 * Invokes native checkout payloads natively configuring keys from the server securely avoiding manipulations
 */
export async function createRazorpayOrder(orderId, token) {
  try {
    const { data } = await api.post("/create-order", { orderId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to structure active checkout window.");
  }
}

/**
 * Securely hashes native inputs avoiding tampering natively converting callbacks safely
 */
export async function verifyRazorpayPayment(payload, token) {
  try {
    const { data } = await api.post("/verify", payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Payment Verification Failed! Transaction was compromised or aborted.");
  }
}
