import prisma from "../config/db.js";

/**
 * verifySeller
 * Ensures the authenticated user has an active seller account.
 * Must be used after authentication middleware.
 */
export async function verifySeller(req, res, next) {
  try {
    // Re-verify the seller status from the DB to ensure it's up-to-date
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { isSeller: true },
    });

    if (!user || !user.isSeller) {
      return res.status(403).json({ error: "Seller account required." });
    }

    next();
  } catch (error) {
    console.error("verifySeller middleware error:", error);
    res.status(500).json({ error: "Internal server error during authorization." });
  }
}
