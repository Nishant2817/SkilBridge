import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getConversation } from "../controllers/messageController.js";

const router = Router();

router.use(authenticate);

// GET /api/messages/:userId
router.get("/:userId", getConversation);

export default router;
