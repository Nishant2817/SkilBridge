const BASE = "/api/auth";

/**
 * POST /api/auth/login
 * @returns {{ token: string, user: object }}
 */
export async function loginUser(email, password) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
}

/**
 * POST /api/auth/register
 * @returns {{ message: string, user: object }}
 */
export async function registerUser(username, email, password, isSeller) {
  const res = await fetch(`${BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, isSeller }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data;
}
