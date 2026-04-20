# SkillBridge — Backend

> Express.js REST API + Socket.io real-time server powering the SkillBridge freelancing platform.

---

## 📋 Table of Contents

- [Purpose](#-purpose)
- [Folder Structure](#-folder-structure)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Socket.io Events](#-socketio-events)
- [Authentication Flow](#-authentication-flow)

---

## 🎯 Purpose

The backend is a **Node.js + Express** application (using ES Modules) that:

- Exposes a RESTful JSON API consumed by the React frontend
- Manages authentication via **JSON Web Tokens (JWT)**
- Persists all data to a **PostgreSQL** database via **Prisma ORM**
- Powers real-time buyer ↔ seller chat using **Socket.io**
- Handles payment order creation and verification via **Razorpay**
- Serves the compiled React frontend in production (unified deployment)

---

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js                 # Prisma client singleton (database connection)
│
├── controllers/              # Business logic — one file per resource
│   ├── adminController.js    # User management, platform stats
│   ├── gigController.js      # CRUD for gig listings
│   ├── messageController.js  # Fetch message history
│   ├── orderController.js    # Order creation, status updates
│   └── paymentController.js  # Razorpay order & verification
│
├── middleware/               # Express middleware
│   ├── auth.js               # Combined auth helper
│   ├── validate.js           # Request body validation
│   ├── verifyAdmin.js        # Admin role guard
│   ├── verifySeller.js       # Seller role guard
│   └── verifyToken.js        # JWT verification (attaches req.user)
│
├── prisma/
│   ├── migrations/           # Auto-generated Prisma migration history
│   └── schema.prisma         # Database schema definition
│
├── routes/                   # Route definitions — one file per resource
│   ├── admin.js
│   ├── auth.js
│   ├── gigs.js
│   ├── messages.js
│   ├── orders.js
│   ├── payment.js
│   ├── test.js               # Health check endpoint
│   └── users.js
│
├── .env.example              # Environment variable template
├── .gitignore
├── package.json
├── prisma.config.js          # Prisma configuration for pg adapter
├── reset-admin.js            # Startup script: ensures admin user exists
└── server.js                 # App entry point — Express + Socket.io setup
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v20+
- A PostgreSQL database (local install or [Render free tier](https://render.com/))

### Steps

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# → Edit .env with your actual values

# 4. Push schema to database
npx prisma db push

# 5. Generate Prisma client
npx prisma generate

# 6. Start dev server (with hot reload)
npm run dev

# Server will be available at http://localhost:5000
```

---

## 🔧 Environment Variables

Create a `.env` file in the `backend/` directory using `.env.example` as your template:

| Variable | Required | Example | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ | `postgresql://user:pass@host/db` | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | `your-very-secret-key` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | ✅ | `7d` | Token expiry duration |
| `RAZORPAY_KEY_ID` | ✅ | `rzp_test_xxxx` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | ✅ | `xxxxxxxxxxxx` | Razorpay secret key |
| `PORT` | ❌ | `5000` | Server port (defaults to 5000) |
| `NODE_ENV` | ❌ | `development` | Set to `production` on Render |

---

## 🛣️ API Endpoints

All routes are prefixed with `/api`.

### 🔐 Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | None | Register a new user |
| `POST` | `/api/auth/login` | None | Login and receive JWT |
| `GET` | `/api/auth/me` | JWT | Get current authenticated user |
| `POST` | `/api/auth/logout` | JWT | Logout (client-side token discard) |

### 👤 Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users/:id` | None | Get a user's public profile |
| `PUT` | `/api/users/:id` | JWT | Update own profile (bio, image) |
| `GET` | `/api/users/:id/gigs` | None | Get all gigs by a seller |
| `DELETE` | `/api/users/:id` | JWT + Admin | Delete a user account |

### 🛍️ Gigs — `/api/gigs`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/gigs` | None | List all gigs (supports `?category=`, `?search=`) |
| `GET` | `/api/gigs/:id` | None | Get a single gig's details |
| `POST` | `/api/gigs` | JWT + Seller | Create a new gig |
| `PUT` | `/api/gigs/:id` | JWT + Seller | Update own gig |
| `DELETE` | `/api/gigs/:id` | JWT + Seller | Delete own gig |

### 📦 Orders — `/api/orders`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/orders` | JWT | Get orders for current user (as buyer) |
| `POST` | `/api/orders` | JWT | Create a new order |
| `PUT` | `/api/orders/:id/complete` | JWT + Seller | Mark order as completed |
| `GET` | `/api/orders/sales` | JWT + Seller | Get sales (orders where user is seller) |

### 💳 Payment — `/api/payment`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/payment/create-order` | JWT | Create Razorpay order |
| `POST` | `/api/payment/verify` | JWT | Verify payment signature & confirm order |

### 💬 Messages — `/api/messages`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/messages/:userId` | JWT | Fetch chat history with a specific user |

### 👑 Admin — `/api/admin`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/users` | JWT + Admin | List all users |
| `DELETE` | `/api/admin/users/:id` | JWT + Admin | Remove a user |
| `GET` | `/api/admin/gigs` | JWT + Admin | List all gigs |
| `DELETE` | `/api/admin/gigs/:id` | JWT + Admin | Remove any gig |
| `GET` | `/api/admin/stats` | JWT + Admin | Platform statistics |

### 🏥 Health Check — `/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/test` | None | Returns `{ status: "ok" }` — used by Render health checks |

---

## 🗄️ Database Schema

```
User
  id, username, email, password (hashed), isSeller, role, bio, image, createdAt
  └── has many → Gig

Gig
  id, title, description, price, category, image, packages (JSON), userId, createdAt
  ├── belongs to → User
  └── has many → Order

Order
  id, gigId, buyerId, sellerId, price, status, paymentId, createdAt
  └── belongs to → Gig

Message
  id, senderId, receiverId, text, createdAt
```

> Full schema: [`prisma/schema.prisma`](./prisma/schema.prisma)

---

## 🔌 Socket.io Events

The server authenticates socket connections via a `token` passed in `socket.handshake.auth`.

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `sendMessage` | `{ receiverId: number, text: string }` | Send a chat message to another user |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `receiveMessage` | `Message object` | Delivered to receiver (if online) and echoed to sender |

> Messages are persisted to the database before delivery, ensuring history is always available via the REST API.

---

## 🔑 Authentication Flow

```
Client                        Server
  │                              │
  │  POST /api/auth/login        │
  │─────────────────────────────>│
  │                              │  Verify password with bcrypt
  │                              │  Sign JWT with userId + role
  │  { token, user }             │
  │<─────────────────────────────│
  │                              │
  │  GET /api/gigs (Authorization: Bearer <token>)
  │─────────────────────────────>│
  │                              │  verifyToken middleware:
  │                              │   - Decode JWT
  │                              │   - Attach user to req.user
  │  Protected resource          │
  │<─────────────────────────────│
```

Tokens are stored in `localStorage` on the client and sent as `Authorization: Bearer <token>` headers.

---

## 📦 Available Scripts

| Script | Command | Description |
|---|---|---|
| `start` | `node reset-admin.js && node server.js` | Production start |
| `dev` | `nodemon server.js` | Development with auto-reload |
| `generate` | `prisma generate` | Regenerate Prisma client |
| `deploy` | `prisma migrate deploy` | Run pending migrations |
| `push` | `prisma db push --accept-data-loss` | Sync schema (dev use) |
