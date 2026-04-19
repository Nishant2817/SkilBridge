import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const stats = [
  { icon: "💼", label: "Active Gigs",    value: "0"   },
  { icon: "📦", label: "Orders",         value: "0"   },
  { icon: "⭐", label: "Avg. Rating",    value: "—"   },
  { icon: "💰", label: "Total Earned",   value: "$0"  },
];

const quickActions = [
  { icon: "➕", label: "Post a New Gig",    path: "/gigs/new",   color: "#1dbf73" },
  { icon: "📋", label: "Manage Orders",     path: "/orders",     color: "#6366f1" },
  { icon: "💬", label: "Messages",          path: "/messages",   color: "#f59e0b" },
  { icon: "📊", label: "Analytics",         path: "/analytics",  color: "#ec4899" },
];

export default function SellerDashboard() {
  const { user, mode, setMode, isSeller } = useAuth();

  // If user is not a seller, show upgrade prompt
  if (!isSeller) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a0f, #0f0f1e)",
        padding: "100px 1.5rem 60px",
      }}>
        <div style={{
          textAlign: "center", maxWidth: "440px",
          background: "rgba(19,19,26,0.9)", border: "1px solid #1e1e2e",
          borderRadius: "24px", padding: "48px 40px",
          backdropFilter: "blur(20px)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🚀</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#e8e8f0", marginBottom: "12px" }}>
            Unlock Seller Features
          </h1>
          <p style={{ color: "#6b6b8a", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "28px" }}>
            Activate your seller account to post gigs, manage orders, and start earning.
          </p>
          <Link to="/" style={{
            display: "inline-block", padding: "14px 32px",
            background: "linear-gradient(135deg, #1dbf73, #0a9d5a)",
            color: "#fff", borderRadius: "12px", fontWeight: "700",
            fontSize: "0.95rem", textDecoration: "none",
            boxShadow: "0 6px 25px rgba(29,191,115,0.4)",
            transition: "transform 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            Go Home
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
        background: "linear-gradient(135deg, #0a0a0f, #0f0f1e)",
        padding: "100px 1.5rem 60px",
      }}>
        <div style={{
          textAlign: "center", maxWidth: "440px",
          background: "rgba(19,19,26,0.9)", border: "1px solid #1e1e2e",
          borderRadius: "24px", padding: "48px 40px",
          backdropFilter: "blur(20px)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🔄</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#e8e8f0", marginBottom: "12px" }}>
            You're in Buyer Mode
          </h1>
          <p style={{ color: "#6b6b8a", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "28px" }}>
            Switch to Seller mode to access your dashboard.
          </p>
          <button
            onClick={() => setMode("seller")}
            style={{
              padding: "14px 32px",
              background: "linear-gradient(135deg, #1dbf73, #0a9d5a)",
              color: "#fff", borderRadius: "12px", fontWeight: "700",
              fontSize: "0.95rem", border: "none", cursor: "pointer",
              boxShadow: "0 6px 25px rgba(29,191,115,0.4)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
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
      background: "linear-gradient(135deg, #0a0a0f 0%, #0c0c18 100%)",
      padding: "100px 2rem 60px",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(29,191,115,0.08)", border: "1px solid rgba(29,191,115,0.2)",
            borderRadius: "20px", padding: "5px 14px", marginBottom: "16px",
          }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#1dbf73", display: "inline-block", animation: "pulse 2s ease infinite" }} />
            <span style={{ color: "#1dbf73", fontSize: "0.8rem", fontWeight: "600" }}>Seller Mode Active</span>
          </div>

          <h1 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: "900", color: "#e8e8f0",
            letterSpacing: "-1px", marginBottom: "8px",
          }}>
            Welcome back, {user?.username} 👋
          </h1>
          <p style={{ color: "#6b6b8a", fontSize: "1rem" }}>
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
              background: "rgba(19,19,26,0.8)", border: "1px solid #1e1e2e",
              borderRadius: "18px", padding: "24px 22px",
              transition: "border-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(29,191,115,0.25)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e2e"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{stat.icon}</div>
              <div style={{
                fontSize: "1.9rem", fontWeight: "900",
                background: "linear-gradient(135deg, #e8e8f0, #a0a0c0)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                marginBottom: "4px",
              }}>
                {stat.value}
              </div>
              <div style={{ color: "#6b6b8a", fontSize: "0.82rem" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Two-column: Quick Actions + First Gig CTA ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>

          {/* Quick Actions */}
          <div style={{
            background: "rgba(19,19,26,0.8)", border: "1px solid #1e1e2e",
            borderRadius: "20px", padding: "28px",
          }}>
            <h2 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#e8e8f0", marginBottom: "20px" }}>
              Quick Actions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {quickActions.map((action) => (
                <Link
                  key={action.path}
                  to={action.path}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "12px 16px", borderRadius: "12px",
                    background: "rgba(255,255,255,0.03)", border: "1px solid #1e1e2e",
                    color: "#c0c0d8", fontSize: "0.9rem", fontWeight: "500",
                    textDecoration: "none", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = action.color + "44"; e.currentTarget.style.color = action.color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "#1e1e2e"; e.currentTarget.style.color = "#c0c0d8"; }}
                >
                  <span style={{ fontSize: "1.2rem", width: "28px", textAlign: "center" }}>{action.icon}</span>
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Post First Gig CTA */}
          <div style={{
            background: "linear-gradient(135deg, rgba(29,191,115,0.06) 0%, rgba(10,157,90,0.04) 100%)",
            border: "1px solid rgba(29,191,115,0.2)", borderRadius: "20px",
            padding: "32px 28px", textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "180px", height: "180px",
              background: "radial-gradient(circle, rgba(29,191,115,0.07) 0%, transparent 70%)",
              filter: "blur(30px)", pointerEvents: "none",
            }} />
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎯</div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#e8e8f0", marginBottom: "10px" }}>
              Post Your First Gig
            </h3>
            <p style={{ color: "#6b6b8a", fontSize: "0.875rem", lineHeight: 1.65, marginBottom: "24px" }}>
              Start earning by showcasing your skills. Your first gig could go live in minutes.
            </p>
            <Link
              to="/gigs/new"
              style={{
                display: "inline-block", padding: "12px 28px",
                background: "linear-gradient(135deg, #1dbf73, #0a9d5a)",
                color: "#fff", borderRadius: "12px", fontWeight: "700",
                fontSize: "0.9rem", textDecoration: "none",
                boxShadow: "0 6px 20px rgba(29,191,115,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(29,191,115,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(29,191,115,0.35)"; }}
            >
              + Create New Gig
            </Link>
          </div>
        </div>

        {/* ── Recent Gigs placeholder ── */}
        <div style={{
          marginTop: "24px",
          background: "rgba(19,19,26,0.8)", border: "1px solid #1e1e2e",
          borderRadius: "20px", padding: "28px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#e8e8f0" }}>
              Your Gigs
            </h2>
            <Link to="/my-gigs" style={{ color: "#1dbf73", fontSize: "0.85rem", textDecoration: "none", fontWeight: "500" }}>
              View all →
            </Link>
          </div>
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#4a4a6a" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📭</div>
            <p style={{ fontSize: "0.9rem" }}>No gigs yet. Post your first gig to get started!</p>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
