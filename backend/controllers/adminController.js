import prisma from "../config/db.js";

// ====== USERS ======

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true, isSeller: true, createdAt: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(users);
  } catch (error) {
    console.error("Admin Get Users Error:", error);
    res.status(500).json({ error: "Failed to pull registry constraints." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!userId) return res.status(400).json({ error: "Invalid user baseline format." });
    
    // Prevent self deletion mapping
    if (userId === req.user.userId) {
      return res.status(400).json({ error: "Cannot delete the active commanding account." });
    }

    // Rely on native Cascades. If no cascade exists in Schema, raw deletes will fail if orders exist. 
    // Wait, prisma standard relations default to Restrict. 
    // To explicitly handle this without modifying schema restrict rules, we just manually delete gigs/orders first.
    await prisma.order.deleteMany({ where: { OR: [{ buyerId: userId }, { sellerId: userId }] } });
    await prisma.gig.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: "User securely disconnected." });
  } catch (error) {
    console.error("Admin Delete User Error:", error);
    res.status(500).json({ error: "Failed to execute destruction sequence." });
  }
};


// ====== GIGS ======

export const getAllGigs = async (req, res) => {
  try {
    const gigs = await prisma.gig.findMany({
      include: {
        user: { select: { username: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(gigs);
  } catch (error) {
    console.error("Admin Get Gigs Error:", error);
    res.status(500).json({ error: "Failed to pull gig aggregations." });
  }
};

export const deleteGig = async (req, res) => {
  try {
    const gigId = Number(req.params.id);
    if (!gigId) return res.status(400).json({ error: "Invalid target." });

    // Clear underlying orders first safely bypassing relation locks
    await prisma.order.deleteMany({ where: { gigId } });
    await prisma.gig.delete({ where: { id: gigId } });

    res.json({ message: "Gig safely eradicated." });
  } catch (error) {
    console.error("Admin Delete Gig Error:", error);
    res.status(500).json({ error: "Failed to eradicate Gig dependencies." });
  }
};


// ====== ORDERS ======

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        gig: { select: { title: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(orders);
  } catch (error) {
    console.error("Admin Get Orders Error:", error);
    res.status(500).json({ error: "Failed to evaluate order histories." });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    if (!orderId) return res.status(400).json({ error: "Invalid layout." });

    await prisma.order.delete({ where: { id: orderId } });
    
    res.json({ message: "Order removed safely." });
  } catch (error) {
    console.error("Admin Delete Order Error:", error);
    res.status(500).json({ error: "Failed to dismantle transaction string." });
  }
};
