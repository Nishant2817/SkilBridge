import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { verifySeller } from "../middleware/verifySeller.js";
import { createOrder, getBuyerOrders, getSellerOrders } from "../controllers/orderController.js";

const router = Router();

// Shield all mappings inside authenticators enforcing JWT payloads
router.use(authenticate);

// Buyer Routes
router.post("/", createOrder);
router.get("/buyer", getBuyerOrders);

// Seller Routes
router.get("/seller", verifySeller, getSellerOrders);

export default router;
