const BASE = "/api/users";

/**
 * PUT /api/users/become-seller
 * Activates seller role for the logged-in user.
 * @param {string} token  - JWT access token
 * @returns {{ message: string, user: object }}
 */
export async function becomeSeller(token) {
  const res = await fetch(`${BASE}/become-seller`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to activate seller account.");
  return data;
}

/**
 * GET /api/users/profile
 * Fetches the latest profile for the logged-in user.
 * @param {string} token
 */
export async function getProfile(token) {
  const res = await fetch(`${BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch profile.");
  return data;
}

/**
 * PUT /api/users/profile
 * Updates username, bio, image for the logged-in user.
 */
export async function updateProfile(fields, token) {
  const res = await fetch(`${BASE}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fields),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update profile.");
  return data;
}

/**
 * GET /api/users/:id
 * Public profile fetch by user ID.
 */
export async function getPublicProfile(userId) {
  const res = await fetch(`${BASE}/${userId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "User not found.");
  return data;
}
