import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { verifySeller } from "../middleware/verifySeller.js";
import { getAnalytics } from "../controllers/analyticsController.js";

const router = Router();

router.use(authenticate);
router.use(verifySeller);

router.get("/", getAnalytics);

export default router;
