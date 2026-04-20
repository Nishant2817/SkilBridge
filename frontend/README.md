# SkillBridge — Frontend

> React 19 + Vite single-page application for the SkillBridge freelancing marketplace.

---

## 📋 Table of Contents

- [Purpose](#-purpose)
- [Folder Structure](#-folder-structure)
- [Local Setup](#-local-setup)
- [Pages & Routes](#-pages--routes)
- [Components Overview](#-components-overview)
- [State Management](#-state-management)
- [API Communication](#-api-communication)
- [Real-time Chat](#-real-time-chat)

---

## 🎯 Purpose

The frontend is a **React 19 Single-Page Application** built with Vite that provides:

- A polished UI for buyers to discover and purchase freelance services
- A seller-facing dashboard to manage gigs and track revenue
- An admin panel for platform management
- Real-time chat between buyers and sellers via Socket.io
- Role-based routing (public / authenticated / seller / admin)

In **development**, Vite proxies all `/api` requests to `http://localhost:5000`, so no CORS configuration is needed locally.

In **production**, the compiled `dist/` folder is served directly by the Express backend as static files.

---

## 📁 Folder Structure

```
frontend/
├── public/                   # Static assets (favicon, images)
│
├── src/
│   ├── api/                  # Axios API call functions
│   │   └── (auth, gigs, orders, etc.)
│   │
│   ├── assets/               # Images, icons used in components
│   │
│   ├── components/           # Reusable UI components
│   │   ├── AuthModal.jsx         # Login/Register modal
│   │   ├── CategoriesSection.jsx # Homepage category grid
│   │   ├── FeaturedGigs.jsx      # Homepage featured listings
│   │   ├── Footer.jsx            # Site-wide footer
│   │   ├── GigCard.jsx           # Gig listing card
│   │   ├── HeroSection.jsx       # Homepage hero banner
│   │   ├── Navbar.jsx            # Top navigation bar
│   │   ├── PopularServices.jsx   # Homepage popular services section
│   │   ├── ProtectedRoute.jsx    # Auth guard wrapper component
│   │   ├── TalentSection.jsx     # Homepage freelancer showcase
│   │   └── TopFreelancers.jsx    # Top-rated sellers section
│   │
│   ├── context/
│   │   └── AuthContext.jsx    # Global auth state (user, login, logout)
│   │
│   ├── pages/                # Route-level page components
│   │   ├── AddGig.jsx            # Create/edit a gig (sellers)
│   │   ├── AdminDashboard.jsx    # Platform admin controls
│   │   ├── Chat.jsx              # Real-time messaging
│   │   ├── Checkout.jsx          # Order checkout + payment
│   │   ├── EditProfile.jsx       # Edit user profile
│   │   ├── GigDetail.jsx         # Single gig detail page
│   │   ├── Gigs.jsx              # Gig browsing + filtering
│   │   ├── Home.jsx              # Landing page
│   │   ├── Login.jsx             # Login page
│   │   ├── MySales.jsx           # Seller sales history
│   │   ├── Orders.jsx            # Buyer order history
│   │   ├── Profile.jsx           # User public profile
│   │   ├── Register.jsx          # Registration page
│   │   └── SellerDashboard.jsx   # Seller overview + analytics
│   │
│   ├── utils/                # Helper functions
│   │
│   ├── socket.js             # Socket.io client instance
│   ├── App.jsx               # Root component — routing tree
│   ├── App.css               # Global component styles
│   ├── index.css             # Base/reset styles
│   └── main.jsx              # React DOM entry point
│
├── .env.example              # Environment variable template
├── .gitignore
├── eslint.config.js          # ESLint configuration
├── index.html                # Vite HTML entry point
├── package.json
└── vite.config.js            # Vite + proxy configuration
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v20+
- Backend server running on `http://localhost:5000`

### Steps

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. (Optional) Configure environment
cp .env.example .env
# Most dev settings work out of the box via Vite proxy

# 4. Start development server
npm run dev

# App available at http://localhost:5173
```

### Other Commands

```bash
npm run build     # Compile for production → dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint checks
```

---

## 🗺️ Pages & Routes

| Route | Component | Auth Required | Description |
|---|---|---|---|
| `/` | `Home` | ❌ | Landing page with hero, categories, featured gigs |
| `/gigs` | `Gigs` | ❌ | Browse all gigs with category/search filter |
| `/gigs/:id` | `GigDetail` | ❌ | Single gig detail with packages and purchase CTA |
| `/seller-dashboard` | `SellerDashboard` | ✅ | Seller overview, active orders, stats |
| `/add-gig` | `AddGig` | ✅ Seller | Create a new gig listing |
| `/create-gig` | `AddGig` | ✅ Seller | Alias for `/add-gig` |
| `/checkout/:gigId` | `Checkout` | ✅ | Order checkout, package selection, payment |
| `/orders` | `Orders` | ✅ | Buyer's order history and status |
| `/my-sales` | `MySales` | ✅ Seller | Sales history for sellers |
| `/chat/:userId` | `Chat` | ✅ | Real-time chat with a specific user |
| `/profile` | `Profile` | ✅ | User's public profile |
| `/profile/edit` | `EditProfile` | ✅ | Edit bio, profile image |
| `/admin` | `AdminDashboard` | ✅ Admin | Platform administration panel |

### Route Groups

- **Public** — Accessible without login
- **Protected (✅)** — Requires a valid JWT; redirects to login if unauthenticated
- **Seller** — User must have `isSeller: true`
- **Admin** — User must have `role: "admin"`

---

## 🧩 Components Overview

### Layout Components
| Component | Description |
|---|---|
| `Navbar` | Top navigation with auth state, links, and mobile menu |
| `Footer` | Site-wide footer with links |
| `AuthModal` | Unified login/register modal triggered from Navbar |
| `ProtectedRoute` | Wraps protected pages; redirects unauthenticated users |

### Home Page Sections
| Component | Description |
|---|---|
| `HeroSection` | Full-width hero with search and CTA |
| `CategoriesSection` | Visual category grid for quick browsing |
| `FeaturedGigs` | Horizontally scrollable featured gig cards |
| `PopularServices` | Popular service tags/pills |
| `TalentSection` | Highlight of top freelancers |
| `TopFreelancers` | Ranked freelancer showcase |

### Shared
| Component | Description |
|---|---|
| `GigCard` | Reusable card for displaying a gig in list views |

---

## 🌐 State Management

Authentication state is managed globally via **React Context**:

```jsx
// src/context/AuthContext.jsx
const AuthContext = createContext();

// Provides:
{
  user,       // Current user object (null if logged out)
  token,      // JWT string
  login(),    // Sets user + token, persists to localStorage
  logout(),   // Clears state + localStorage
  isLoading   // True while checking persisted session on mount
}
```

All components access auth state via the `useAuth()` hook:

```jsx
import { useAuth } from "../context/AuthContext";
const { user, logout } = useAuth();
```

---

## 🔗 API Communication

All backend calls are made using **Axios**. The Vite dev server proxies `/api/*` requests to `http://localhost:5000`:

```js
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }
  }
}
```

In production, the frontend is served by the same Express server, so no proxy is needed.

---

## 💬 Real-time Chat

The Socket.io client is initialized in `src/socket.js` with JWT authentication:

```js
// src/socket.js
import { io } from "socket.io-client";

export const createSocket = (token) =>
  io("/", { auth: { token } });
```

The `Chat` page creates a connection on mount and cleans up on unmount.

**Events used:**
- **Emit** `sendMessage` → `{ receiverId, text }`
- **Listen** `receiveMessage` → `{ ...messageObject }`

---

## 🎨 Styling

- **TailwindCSS v4** (via `@tailwindcss/vite` plugin) for utility classes
- **Global styles** in `src/index.css` (resets, custom properties)
- **Component styles** in `src/App.css` (shared layout utilities)
- Inline styles used for one-off overrides in complex components
