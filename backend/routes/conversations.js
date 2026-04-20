import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { createConversation, getConversations } from "../controllers/conversationController.js";

const router = Router();
router.use(authenticate);

router.post("/", createConversation);
router.get("/", getConversations);

export default router;
