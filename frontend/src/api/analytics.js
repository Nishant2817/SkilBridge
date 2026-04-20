import axios from "axios";

export async function getAnalytics(token) {
  try {
    const { data } = await axios.get("/api/analytics", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch analytics");
  }
}
