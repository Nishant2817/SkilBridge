import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { verifySeller } from "../middleware/verifySeller.js";
import { getAllGigs, getGigById, createGig, deleteGig } from "../controllers/gigController.js";

const router = Router();

// GET /api/gigs?category=&search=
router.get("/", getAllGigs);

// GET /api/gigs/:id
router.get("/:id", getGigById);

// POST /api/gigs  — seller only
router.post("/", authenticate, verifySeller, createGig);

// DELETE /api/gigs/:id  — owner only
router.delete("/:id", authenticate, deleteGig);

export default router;
