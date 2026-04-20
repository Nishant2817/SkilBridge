import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { getAnalytics } from "../api/analytics";

const quickActions = [
  { icon: "➕", label: "Post a New Gig",    path: "/add-gig",   color: "#10b981", bg: "#ecfdf5" },
  { icon: "📋", label: "Manage Orders",     path: "/orders",     color: "#6366f1", bg: "#eef2ff" },
  { icon: "💬", label: "Messages",          path: "/messages",   color: "#f59e0b", bg: "#fffbeb" },
];

export default function SellerDashboard() {
  const { user, mode, setMode, isSeller, token } = useAuth();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (isSeller && mode === "seller") {
      getAnalytics(token).then(setAnalytics).catch(console.error);
    }
  }, [isSeller, mode, token]);

  const stats = [
    { icon: "💼", label: "Active Gigs",    value: analytics?.totalGigs || "0",   color: "#3b82f6", bg: "#eff6ff" },
    { icon: "📦", label: "Orders Linked",  value: analytics?.totalOrders || "0",   color: "#8b5cf6", bg: "#f5f3ff" },
    { icon: "⭐", label: "Completed",      value: analytics?.completedOrders || "0",   color: "#f59e0b", bg: "#fffbeb" },
    { icon: "💰", label: "Total Earned",   value: `$${analytics?.totalEarnings || 0}`,  color: "#10b981", bg: "#ecfdf5" },
  ];

  // If user is not a seller, show upgrade prompt
  if (!isSeller) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #fdf4ff 0%, #f3f4f6 100%)",
        padding: "100px 1.5rem 60px",
      }}>
        <div style={{
          textAlign: "center", maxWidth: "440px",
          background: "#ffffff", border: "1px solid #fce7f3",
          borderRadius: "24px", padding: "48px 40px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)",
        }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "16px", background: "#fdf2f8", display: "inline-flex", borderRadius: "50%", padding: "16px" }}>🚀</div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#111827", marginBottom: "12px" }}>
            Unlock Seller Features
          </h1>
          <p style={{ color: "#4b5563", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "28px" }}>
            Activate your seller account to post gigs, manage orders, and start earning on the platform.
          </p>
          <Link to="/" style={{
            display: "inline-block", padding: "14px 32px",
            background: "linear-gradient(135deg, #ec4899, #be185d)",
            color: "#fff", borderRadius: "30px", fontWeight: "600",
            fontSize: "1rem", textDecoration: "none",
            transition: "transform 0.2s",
            boxShadow: "0 8px 16px rgba(236, 72, 153, 0.2)",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            Discover Services
          </Link>
        </div>
      </div>
    );
  }

  // If seller is in buyer mode, prompt switch
  if (mode !== "seller") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #ecfdf5 0%, #f3f4f6 100%)",
        padding: "100px 1.5rem 60px",
      }}>
        <div style={{
          textAlign: "center", maxWidth: "440px",
          background: "#ffffff", border: "1px solid #d1fae5",
          borderRadius: "24px", padding: "48px 40px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)",
        }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "16px", background: "#ecfdf5", display: "inline-flex", borderRadius: "50%", padding: "16px" }}>🔄</div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#111827", marginBottom: "12px" }}>
            You're in Buyer Mode
          </h1>
          <p style={{ color: "#4b5563", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "28px" }}>
            Switch to Seller mode to access your dashboard, gigs, and view your incoming orders.
          </p>
          <button
            onClick={() => setMode("seller")}
            style={{
              padding: "14px 32px",
              background: "#059669",
              color: "#fff", borderRadius: "30px", fontWeight: "600",
              fontSize: "1rem", border: "none", cursor: "pointer",
              boxShadow: "0 8px 16px rgba(5, 150, 105, 0.2)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "#047857"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "#059669"; }}
          >
            Switch to Seller Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      padding: "100px 2rem 60px",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#dcfce7", border: "1px solid #bbf7d0",
            borderRadius: "20px", padding: "6px 16px", marginBottom: "16px",
          }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s ease infinite" }} />
            <span style={{ color: "#166534", fontSize: "0.85rem", fontWeight: "700" }}>Seller Mode Active</span>
          </div>

          <h1 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: "900", color: "#0f172a",
            letterSpacing: "-1px", marginBottom: "8px",
          }}>
            Welcome back, {user?.username} 👋
          </h1>
          <p style={{ color: "#64748b", fontSize: "1.05rem" }}>
            Here's an overview of your seller activity.
          </p>
        </div>

        {/* ── Stats Grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px", marginBottom: "40px",
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{
              background: "#ffffff", border: "1px solid #e2e8f0",
              borderRadius: "18px", padding: "24px 22px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
              transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = stat.color; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.02)"; }}
            >
              <div style={{ 
                fontSize: "1.5rem", marginBottom: "16px", background: stat.bg, 
                width: "48px", height: "48px", display: "flex", alignItems: "center", 
                justifyContent: "center", borderRadius: "12px" 
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: "2rem", fontWeight: "900",
                color: "#1e293b",
                marginBottom: "4px", lineHeight: "1",
              }}>
                {stat.value}
              </div>
              <div style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: "500" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Two-column: Quick Actions + First Gig CTA ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>

          {/* Quick Actions */}
          <div style={{
            background: "#ffffff", border: "1px solid #e2e8f0",
            borderRadius: "20px", padding: "32px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
          }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", marginBottom: "24px" }}>
              Quick Actions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {quickActions.map((action) => (
                <Link
                  key={action.path}
                  to={action.path}
                  style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    padding: "16px", borderRadius: "12px",
                    background: "#f8fafc", border: "1px solid #f1f5f9",
                    color: "#334155", fontSize: "0.95rem", fontWeight: "600",
                    textDecoration: "none", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.background = action.bg; 
                    e.currentTarget.style.borderColor = action.color + "33"; 
                    e.currentTarget.style.color = action.color; 
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.background = "#f8fafc"; 
                    e.currentTarget.style.borderColor = "#f1f5f9"; 
                    e.currentTarget.style.color = "#334155"; 
                  }}
                >
                  <span style={{ 
                    fontSize: "1.2rem", width: "40px", height: "40px", 
                    display: "flex", alignItems: "center", justifyContent: "center", 
                    background: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" 
                  }}>
                    {action.icon}
                  </span>
                  {action.label}
                  <span style={{ marginLeft: "auto", fontSize: "1.2rem", color: "#cbd5e1" }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Post First Gig CTA */}
          <div style={{
            background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
            border: "1px solid #a7f3d0", borderRadius: "20px",
            padding: "40px 32px", textAlign: "center",
            position: "relative", overflow: "hidden",
            boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.1)",
          }}>
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "180px", height: "180px",
              background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{ fontSize: "3.5rem", marginBottom: "20px" }}>🎯</div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#065f46", marginBottom: "12px" }}>
              Post Your First Gig
            </h3>
            <p style={{ color: "#047857", fontSize: "1rem", lineHeight: 1.6, marginBottom: "32px", fontWeight: "500" }}>
              Start earning by showcasing your skills. Your first gig could go live in minutes.
            </p>
            <Link
              to="/gigs/new"
              style={{
                display: "inline-block", padding: "16px 36px",
                background: "#059669",
                color: "#fff", borderRadius: "30px", fontWeight: "700",
                fontSize: "1rem", textDecoration: "none",
                boxShadow: "0 8px 16px rgba(5, 150, 105, 0.25)",
                transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
              }}
              onMouseEnter={e => { 
                e.currentTarget.style.transform = "translateY(-3px)"; 
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(5, 150, 105, 0.3)";
                e.currentTarget.style.background = "#047857";
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.transform = "translateY(0)"; 
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(5, 150, 105, 0.25)"; 
                e.currentTarget.style.background = "#059669";
              }}
            >
              + Create New Gig
            </Link>
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div style={{
          marginTop: "24px",
          background: "#ffffff", border: "1px solid #e2e8f0",
          borderRadius: "20px", padding: "32px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>
              Recent Orders
            </h2>
            <Link to="/my-sales" style={{ color: "#059669", fontSize: "0.95rem", textDecoration: "none", fontWeight: "600" }}>
              View all →
            </Link>
          </div>
          
          {analytics?.recentActivity?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {analytics.recentActivity.map(order => (
                <div key={order.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                     <img src={order.gig?.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=200"} 
                          alt="gig thumbnail" style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "8px" }} />
                     <div>
                       <p style={{ fontWeight: "700", color: "#1e293b", margin: 0, fontSize: "0.95rem" }}>{order.gig?.title}</p>
                       <p style={{ color: "#64748b", margin: 0, fontSize: "0.85rem" }}>Ordered by <strong>{order.buyer?.username}</strong></p>
                     </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                     <p style={{ fontWeight: "800", color: "#10b981", margin: 0, fontSize: "1.1rem" }}>${order.price}</p>
                     <p style={{ color: "#64748b", margin: 0, fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "600" }}>{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "48px 20px", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px", filter: "grayscale(100%) opacity(50%)" }}>📭</div>
              <p style={{ fontSize: "1rem", color: "#64748b", fontWeight: "500", margin: 0 }}>No orders yet. They will appear here once gig orders start rolling in.</p>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
