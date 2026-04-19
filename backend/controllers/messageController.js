import prisma from "../config/db.js";

// GET /api/messages/:userId
// Returns full conversation between the logged-in user and the target user
export const getConversation = async (req, res) => {
  const { userId: targetId } = req.params;
  const myId = req.user.userId;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId,           receiverId: Number(targetId) },
          { senderId: Number(targetId), receiverId: myId           },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (err) {
    console.error("getConversation error:", err);
    res.status(500).json({ error: "Failed to load messages." });
  }
};
