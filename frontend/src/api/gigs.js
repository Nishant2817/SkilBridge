import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/gigs",
});

/**
 * GET /api/gigs?category=&search=
 */
export async function getAllGigs(filters = {}) {
  try {
    const { data } = await api.get("/", { params: filters });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch gigs");
  }
}

/**
 * GET /api/gigs/:id
 */
export async function getGigById(id) {
  try {
    const { data } = await api.get(`/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Gig not found");
  }
}

/**
 * POST /api/gigs  — requires JWT
 */
export async function createGig(gigData, token) {
  try {
    const { data } = await api.post("/", gigData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to create gig");
  }
}

/**
 * DELETE /api/gigs/:id  — requires JWT
 */
export async function deleteGig(id, token) {
  try {
    const { data } = await api.delete(`/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to delete gig");
  }
}
