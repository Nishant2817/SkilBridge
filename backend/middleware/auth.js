import jwt from "jsonwebtoken";

/**
 * Verifies the JWT from Authorization: Bearer <token> header.
 * Attaches { userId, isSeller } to req.user on success.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, isSeller: payload.isSeller, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

/**
 * verifyToken — alias for authenticate (supports legacy imports).
 */
export const verifyToken = authenticate;

/**
 * verifySeller / requireSeller
 * Ensures the authenticated user has isSeller === true.
 * Must be used after authenticate().
 *
 * NOTE: isSeller in the JWT reflects the value at login time.
 * After "become-seller" the client must re-login (or the backend
 * re-checks the DB) to get an updated token. The gig routes
 * re-query the DB, so they are always authoritative.
 */
export function verifySeller(req, res, next) {
  if (!req.user?.isSeller) {
    return res.status(403).json({ error: "Seller account required." });
  }
  next();
}

// Backward-compat alias
export const requireSeller = verifySeller;
