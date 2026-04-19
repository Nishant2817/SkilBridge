import prisma from "../config/db.js";

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { gigId } = req.body;
    const buyerId = req.user.userId;

    if (!gigId) {
      return res.status(400).json({ error: "Gig ID is required" });
    }

    // 1. Fetch Gig from DB to extract unmanipulated constraints (seller, price)
    const gig = await prisma.gig.findUnique({
      where: { id: Number(gigId) }
    });

    if (!gig) {
      return res.status(404).json({ error: "Target gig not found" });
    }
    
    if (gig.userId === buyerId) {
      return res.status(400).json({ error: "You cannot purchase your own gig" });
    }

    // 2. Create the immutable order
    const order = await prisma.order.create({
      data: {
        gigId: gig.id,
        buyerId: buyerId,
        sellerId: gig.userId, // Pulled cleanly from authoritative gig owner constraint
        price: gig.price,     // Native extraction, avoids forged client totals
        status: "pending"
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// GET /api/orders/buyer
export const getBuyerOrders = async (req, res) => {
  try {
    const buyerId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: { buyerId },
      include: {
        gig: {
          select: { title: true, image: true, category: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(orders);
  } catch (error) {
    console.error("Get Buyer Orders Error:", error);
    res.status(500).json({ error: "Failed to fetch active buyer orders" });
  }
};

// GET /api/orders/seller
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: { sellerId },
      include: {
        gig: {
          select: { title: true, image: true, category: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(orders);
  } catch (error) {
    console.error("Get Seller Orders Error:", error);
    res.status(500).json({ error: "Failed to fetch active seller transactions" });
  }
};
