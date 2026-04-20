import prisma from "../config/db.js";

export const createConversation = async (req, res) => {
  const { participantId } = req.body;
  const myId = req.user.userId;

  try {
    const [id1, id2] = [myId, Number(participantId)].sort((a,b) => a - b);

    let conv = await prisma.conversation.findUnique({
        where: {
            buyerId_sellerId: { buyerId: id1, sellerId: id2 }
        }
    });

    if (!conv) {
        conv = await prisma.conversation.create({
            data: { buyerId: id1, sellerId: id2 }
        });
    }

    res.status(201).json(conv);
  } catch (err) {
    console.error("createConversation error:", err);
    res.status(500).json({ error: "Failed to create conversation." });
  }
};

export const getConversations = async (req, res) => {
  const myId = req.user.userId;

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { buyerId: myId },
          { sellerId: myId },
        ],
      },
      include: {
         buyer: { select: { id: true, username: true, image: true } },
         seller: { select: { id: true, username: true, image: true } },
         messages: {
           orderBy: { createdAt: "desc" },
           take: 1
         }
      },
      orderBy: { updatedAt: "desc" }
    });
    
    res.json(conversations);
  } catch (err) {
    console.error("getConversations error:", err);
    res.status(500).json({ error: "Failed to fetch conversations." });
  }
};
