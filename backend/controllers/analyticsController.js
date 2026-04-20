import prisma from "../config/db.js";

// GET /api/analytics
export const getAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    
    // Count total active gigs created by this seller
    const totalGigs = await prisma.gig.count({ where: { userId: sellerId } });
    
    // Fetch all orders mapped to this seller
    const orders = await prisma.order.findMany({ 
      where: { sellerId },
      orderBy: { createdAt: "desc" }
    });
    
    let totalEarnings = 0;
    let completedOrders = 0;
    
    // Calculate totals
    orders.forEach(order => {
        if (order.status === "completed") {
            totalEarnings += order.price;
            completedOrders++;
        }
    });

    res.json({
        totalEarnings,
        totalOrders: orders.length,
        completedOrders,
        totalGigs
    });

  } catch (err) {
    console.error("GET /analytics error:", err);
    res.status(500).json({ error: "Failed to fetch analytics." });
  }
};
