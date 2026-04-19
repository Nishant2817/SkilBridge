import { Router } from "express";
import prisma from "../config/db.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Shared safe select — never expose password hash
const USER_SELECT = {
  id: true,
  username: true,
  email: true,
  isSeller: true,
  role: true,
  bio: true,
  image: true,
  createdAt: true,
};

// GET /api/users/profile  — own profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: USER_SELECT,
    });
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ user });
  } catch (err) {
    console.error("GET /profile error:", err);
    res.status(500).json({ error: "Server error fetching profile." });
  }
});

// PUT /api/users/profile  — update own profile
router.put("/profile", authenticate, async (req, res) => {
  const { username, bio, image } = req.body;

  if (username !== undefined && !username.trim()) {
    return res.status(400).json({ error: "Username cannot be empty." });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        ...(username ? { username: username.trim() } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(image !== undefined ? { image } : {}),
      },
      select: USER_SELECT,
    });
    res.json({ user: updated });
  } catch (err) {
    console.error("PUT /profile error:", err);
    res.status(500).json({ error: "Server error updating profile." });
  }
});

// GET /api/users/:id  — public profile by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      select: { id: true, username: true, bio: true, image: true, isSeller: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ user });
  } catch (err) {
    console.error("GET /users/:id error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

// PUT /api/users/become-seller
router.put("/become-seller", authenticate, async (req, res) => {
  try {
    const existing = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!existing) return res.status(404).json({ error: "User not found." });
    if (existing.isSeller) return res.status(400).json({ error: "You are already a seller." });

    const updated = await prisma.user.update({
      where: { id: req.user.userId },
      data: { isSeller: true },
      select: USER_SELECT,
    });
    res.json({ message: "Seller account activated successfully!", user: updated });
  } catch (err) {
    console.error("become-seller error:", err);
    res.status(500).json({ error: "Server error activating seller account." });
  }
});

export default router;
