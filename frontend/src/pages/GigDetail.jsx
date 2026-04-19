import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getGigById } from "../api/gigs";
import { createOrder } from "../api/orders";
import { useAuth } from "../context/AuthContext";

const CATEGORY_ICONS = {
  "Design": "🎨",
  "Development": "💻",
  "Marketing": "📢",
  "Writing": "✍️",
  "Video": "🎬",
  "Music": "🎵",
  "Business": "💼",
  "Data": "📊",
};

export default function GigDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getGigById(id);
        setGig(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "50%",
          border: "3px solid #1e1e2e", borderTop: "3px solid #1dbf73",
          animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
        }} />
        <p style={{ color: "#6b6b8a" }}>Loading gig…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
      <div style={{ textAlign: "center", color: "#f87171" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>😕</div>
        <h2 style={{ marginBottom: "8px" }}>{error}</h2>
        <Link to="/" style={{ color: "#1dbf73" }}>← Back to home</Link>
      </div>
    </div>
  );

  const categoryIcon = CATEGORY_ICONS[gig.category] || "🔧";
  const joinedYear = gig.user?.createdAt
    ? new Date(gig.user.createdAt).getFullYear()
    : "N/A";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0f 0%, #0f0f1e 100%)",
      padding: "100px 1.5rem 60px",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
          <Link to="/" style={{ color: "#6b6b8a", fontSize: "0.875rem", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.color = "#1dbf73"}
            onMouseLeave={e => e.currentTarget.style.color = "#6b6b8a"}
          >
            Home
          </Link>
          <span style={{ color: "#3a3a5a" }}>›</span>
          <span style={{ color: "#6b6b8a", fontSize: "0.875rem" }}>{gig.category}</span>
          <span style={{ color: "#3a3a5a" }}>›</span>
          <span style={{ color: "#c0c0d8", fontSize: "0.875rem" }}>{gig.title}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "32px", alignItems: "start" }}>

          {/* LEFT — Gig content */}
          <div>
            {/* Category badge */}
            <div style={{ marginBottom: "16px" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "rgba(29,191,115,0.1)", border: "1px solid rgba(29,191,115,0.25)",
                borderRadius: "20px", padding: "5px 14px",
                color: "#1dbf73", fontSize: "0.8rem", fontWeight: "600",
              }}>
                {categoryIcon} {gig.category}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
              fontWeight: "800", color: "#e8e8f0",
              letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: "24px",
            }}>
              {gig.title}
            </h1>

            {/* Seller row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.9rem", fontWeight: "700", color: "#fff",
              }}>
                {gig.user?.username?.slice(0, 2).toUpperCase() || "?"}
              </div>
              <div>
                <div style={{ fontWeight: "700", color: "#c0c0d8", fontSize: "0.95rem" }}>
                  {gig.user?.username || "Unknown"}
                </div>
                <div style={{ color: "#6b6b8a", fontSize: "0.78rem" }}>Member since {joinedYear}</div>
              </div>
            </div>

            {/* Gig image / placeholder */}
            <div style={{
              width: "100%", aspectRatio: "16/9",
              borderRadius: "20px", overflow: "hidden",
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
              border: "1px solid #1e1e2e",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "5rem", marginBottom: "32px",
            }}>
              {gig.image
                ? <img src={gig.image} alt={gig.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span>{categoryIcon}</span>
              }
            </div>

            {/* Description */}
            <div style={{
              background: "rgba(19,19,26,0.7)", border: "1px solid #1e1e2e",
              borderRadius: "18px", padding: "28px",
            }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#e8e8f0", marginBottom: "14px" }}>
                About this gig
              </h2>
              <p style={{ color: "#9090b0", lineHeight: 1.75, fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>
                {gig.description}
              </p>
            </div>
          </div>

          {/* RIGHT — Sticky order card */}
          <div style={{ position: "sticky", top: "90px" }}>
            <div style={{
              background: "rgba(19,19,26,0.9)", border: "1px solid #1e1e2e",
              borderRadius: "20px", padding: "28px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              backdropFilter: "blur(20px)",
            }}>
              {/* Price */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ color: "#6b6b8a", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                  Starting at
                </div>
                <div style={{
                  fontSize: "2.2rem", fontWeight: "900",
                  background: "linear-gradient(135deg, #1dbf73, #0a9d5a)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  ${Number(gig.price).toFixed(2)}
                </div>
              </div>

              <div style={{ borderTop: "1px solid #1e1e2e", padding: "16px 0", marginBottom: "4px" }}>
                {[
                  { icon: "⚡", label: "Fast Delivery" },
                  { icon: "🔁", label: "2 Revisions" },
                  { icon: "✅", label: "Money-back Guarantee" },
                ].map(item => (
                  <div key={item.label} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    color: "#9090b0", fontSize: "0.875rem", marginBottom: "10px",
                  }}>
                    <span>{item.icon}</span> {item.label}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                id="gig-order-now"
                disabled={orderLoading}
                onClick={async () => {
                  if (!isAuthenticated) { navigate("/login"); return; }
                  try {
                    setOrderLoading(true);
                    await createOrder(gig.id, user?.token);
                    navigate("/orders");
                  } catch (err) {
                    alert(err.message);
                  } finally {
                    setOrderLoading(false);
                  }
                }}
                style={{
                  width: "100%", padding: "15px",
                  background: "linear-gradient(135deg, #1dbf73, #0a9d5a)",
                  color: "#fff", borderRadius: "12px",
                  fontWeight: "700", fontSize: "1rem", border: "none",
                  cursor: orderLoading ? "not-allowed" : "pointer",
                  boxShadow: "0 6px 25px rgba(29,191,115,0.4)",
                  transition: "transform 0.2s, box-shadow 0.2s", marginBottom: "12px",
                  opacity: orderLoading ? 0.7 : 1
                }}
                onMouseEnter={e => { if (!orderLoading) e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 10px 35px rgba(29,191,115,0.55)"; }}
                onMouseLeave={e => { if (!orderLoading) e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 25px rgba(29,191,115,0.4)"; }}
              >
                {orderLoading ? "Processing..." : (isAuthenticated ? "Order Now" : "Sign in to Order")}
              </button>

              <button
                onClick={() => {
                  if (!isAuthenticated) { navigate("/login"); return; }
                  navigate(`/chat/${gig.user?.id}`);
                }}
                style={{
                  width: "100%", padding: "13px",
                  background: "transparent", border: "1px solid #2a2a3a",
                  color: "#c0c0d8", borderRadius: "12px",
                  fontWeight: "600", fontSize: "0.95rem",
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#1dbf73"; e.currentTarget.style.color = "#1dbf73"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a3a"; e.currentTarget.style.color = "#c0c0d8"; }}
              >
                💬 Message Seller
              </button>

              {/* Posted date */}
              <p style={{ textAlign: "center", color: "#4a4a6a", fontSize: "0.75rem", marginTop: "16px" }}>
                Posted {new Date(gig.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
