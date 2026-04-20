import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import jwt from "jsonwebtoken";
import prisma from "./config/db.js";

import testRoutes    from "./routes/test.js";
import gigRoutes     from "./routes/gigs.js";
import authRoutes    from "./routes/auth.js";
import userRoutes    from "./routes/users.js";
import orderRoutes   from "./routes/orders.js";
import adminRoutes   from "./routes/admin.js";
import paymentRoutes from "./routes/payment.js";
import messageRoutes from "./routes/messages.js";
import conversationRoutes from "./routes/conversations.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();

const app        = express();
const httpServer = createServer(app);
const PORT       = process.env.PORT || 5000;

// ── Socket.io ────────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? true : "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Map  userId  →  socket.id  for targeted delivery
const onlineUsers = new Map();

io.use((socket, next) => {
  // Authenticate via token query param sent during connection handshake
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication required"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log(`🟢 Socket connected: userId=${socket.userId}`);
  onlineUsers.set(socket.userId, socket.id);

  // ── sendMessage ────────────────────────────────────────────────────────────
  socket.on("sendMessage", async ({ receiverId, text }) => {
    if (!receiverId || !text?.trim()) return;

    try {
      // Persist to DB — sender is ALWAYS the authenticated user, never from payload
      const message = await prisma.message.create({
        data: {
          senderId:   socket.userId,
          receiverId: Number(receiverId),
          text:       text.trim(),
        },
      });

      // Deliver to receiver if online
      const receiverSocketId = onlineUsers.get(Number(receiverId));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", message);
      }

      // Echo back to sender so their UI also gets the DB-persisted version
      socket.emit("receiveMessage", message);
    } catch (err) {
      console.error("sendMessage socket error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Socket disconnected: userId=${socket.userId}`);
    onlineUsers.delete(socket.userId);
  });
});

// ── Express middleware ────────────────────────────────────────────────────────
app.use(cors({ 
  origin: process.env.NODE_ENV === "production" ? true : "http://localhost:5173", 
  credentials: true 
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api",          testRoutes);
app.use("/api/gigs",     gigRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/admin",    adminRoutes);
app.use("/api/payment",  paymentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/analytics", analyticsRoutes);

// ── Production Frontend Serving ────────────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
  });
}

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
