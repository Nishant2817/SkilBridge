import { Link } from "react-router-dom";
import { useState } from "react";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop";

const CATEGORY_COLORS = {
  Design: "#8b5cf6",
  Development: "#3b82f6",
  Marketing: "#f97316",
  Writing: "#eab308",
  Video: "#ec4899",
  Music: "#06b6d4",
  Business: "#10b981",
  Data: "#6366f1",
  "UI/UX": "#8b5cf6",
};

export default function GigCard({ gig, onDelete }) {
  const [liked, setLiked] = useState(false);
  const price = Number(gig.price) || 0;
  const hasImage = Boolean(gig.image);
  const catColor = CATEGORY_COLORS[gig.category] || "#1dbf73";
  const initials = gig.user?.username?.slice(0, 2).toUpperCase() || "?";
  const rating = gig.rating || 4.0;

  return (
    <div style={{
      borderRadius: 16,
      overflow: "hidden",
      background: "#fff",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      border: "1px solid #f0f0f0",
      transition: "all 0.25s ease",
      display: "flex",
      flexDirection: "column",
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 10px 35px rgba(0,0,0,0.12)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <Link to={`/gigs/${gig.id}`} style={{ display: "block", position: "relative" }}>
        <div style={{ width: "100%", height: 200, overflow: "hidden", position: "relative" }}>
          <img
            src={hasImage ? gig.image : FALLBACK_IMAGE}
            alt={gig.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
            onMouseEnter={(e) => { e.target.style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; }}
          />

          {/* Crown icon (top-left) */}
          <div style={{
            position: "absolute",
            top: 12,
            left: 12,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            fontSize: 16,
          }}>
            👑
          </div>

          {/* Heart icon (top-right) */}
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#fff",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              cursor: "pointer",
              fontSize: 16,
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            {liked ? "❤️" : "🤍"}
          </button>
        </div>
      </Link>

      {/* Body */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {/* Category label */}
        {gig.category && (
          <Link
            to={`/gigs?category=${encodeURIComponent(gig.category)}`}
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: catColor,
              textDecoration: "none",
            }}
          >
            {gig.category}
          </Link>
        )}

        {/* Title */}
        <Link to={`/gigs/${gig.id}`} style={{ textDecoration: "none" }}>
          <h3 style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#1a1a2e",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            margin: 0,
          }}>
            {gig.title}
          </h3>
        </Link>

        {/* Seller row */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: `${catColor}22`,
            border: `1.5px solid ${catColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.6rem",
            fontWeight: 700,
            color: catColor,
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <span style={{ color: "#6b7280", fontSize: "0.78rem" }}>
            {gig.user?.username || "Anonymous"}
          </span>
        </div>

        {/* Star rating */}
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ fontSize: 12, color: i < Math.round(rating) ? "#fbbf24" : "#d1d5db" }}>★</span>
          ))}
          <span style={{ fontSize: "0.75rem", color: "#6b7280", marginLeft: 3 }}>({rating.toFixed(1)})</span>
        </div>

        {/* Price */}
        <div style={{
          marginTop: "auto",
          paddingTop: 12,
          borderTop: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a1a2e" }}>
            ${price.toLocaleString()}
          </span>
          <Link
            to={`/gigs/${gig.id}`}
            style={{
              fontSize: "0.78rem",
              color: "#1dbf73",
              fontWeight: 600,
              border: "1px solid #1dbf73",
              padding: "4px 12px",
              borderRadius: 50,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1dbf73"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1dbf73"; }}
          >
            View
          </Link>
        </div>

        {/* Delete option for My Gigs */}
        {onDelete && (
          <button
            onClick={() => onDelete(gig.id)}
            style={{
              marginTop: "8px",
              width: "100%",
              padding: "8px",
              background: "#fee2e2",
              color: "#dc2626",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}
          >
            🗑️ Delete Gig
          </button>
        )}
      </div>
    </div>
  );
}
