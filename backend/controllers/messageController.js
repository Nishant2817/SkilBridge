import prisma from "../config/db.js";

export const getMessagesByConversationId = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
         sender: { select: { username: true, image: true } }
      }
    });
    res.json(messages);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ error: "Failed to load messages." });
  }
};

export const createMessage = async (req, res) => {
    const { conversationId, text } = req.body;
    const senderId = req.user.userId;

    try {
        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId,
                text,
            }
        });

        // Bump the conversation updatedAt
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
        });

        res.status(201).json(message);
    } catch (err) {
        console.error("createMessage error:", err);
        res.status(500).json({ error: "Failed to send message." });
    }
}
