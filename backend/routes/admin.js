import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { 
  getAllUsers, deleteUser,
  getAllGigs, deleteGig,
  getAllOrders, deleteOrder
} from "../controllers/adminController.js";

const router = Router();

// Fully lock out API endpoints with generic authentication AND specific Role-bound verifiers.
router.use(authenticate, verifyAdmin);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Gigs
router.get("/gigs", getAllGigs);
router.delete("/gigs/:id", deleteGig);

// Orders
router.get("/orders", getAllOrders);
router.delete("/orders/:id", deleteOrder);

export default router;
