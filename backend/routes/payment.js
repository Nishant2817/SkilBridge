import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController.js";

const router = Router();

// Fully lock out generic payload executions enforcing strict JWT tokens!
router.use(authenticate);

// Maps natively pulling the required payload hashes evaluating local arrays natively
router.post("/create-order", createPaymentOrder);

// Executes raw cryptographic evaluation strings verifying checkout completions 
router.post("/verify", verifyPayment);

export default router;
