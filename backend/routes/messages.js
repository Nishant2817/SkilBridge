import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getMessagesByConversationId, createMessage } from "../controllers/messageController.js";

const router = Router();

router.use(authenticate);

router.get("/:conversationId", getMessagesByConversationId);
router.post("/", createMessage);

export default router;
