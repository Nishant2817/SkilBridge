import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { becomeSeller } from "../api/users";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdown] = useState(false);
  const [activating, setActivating] = useState(false);
  const [activateErr, setActivateErr] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dropRef = useRef(null);

  const { isAuthenticated, user, token, mode, setMode, logout, activateSeller, isSeller, isAdmin } = useAuth();

  // ── scroll effect ──────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── close dropdown on outside click ───────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdown(false);
        setActivateErr("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdown(false);
    navigate("/");
  };

  // ── become seller ──────────────────────────────────────────────────────
  const handleBecomeSeller = async () => {
    setActivateErr("");
    setActivating(true);
    try {
      const { user: updatedUser } = await becomeSeller(token);
      activateSeller(updatedUser); // updates context + switches to seller mode
      setDropdown(false);
    } catch (err) {
      setActivateErr(err.message);
    } finally {
      setActivating(false);
    }
  };

  // ── mode toggle ────────────────────────────────────────────────────────
  const handleModeToggle = () => {
    if (!isSeller) return; // guard — non-sellers can't toggle
    setMode(mode === "buyer" ? "seller" : "buyer");
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "??";

  // ── styles ─────────────────────────────────────────────────────────────
  const dropItemStyle = {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "9px 12px", borderRadius: "8px",
    color: "#c0c0d8", fontSize: "0.875rem", fontWeight: "500",
    textDecoration: "none", transition: "all 0.15s", cursor: "pointer",
    background: "none", border: "none", width: "100%", textAlign: "left",
  };

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(10,10,15,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(42,42,58,0.6)" : "none",
        padding: "0 2rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "70px" }}>

        {/* ── Logo ── */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #1dbf73, #0a9d5a)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "800", color: "#fff" }}>
            S
          </div>
          <span style={{ fontSize: "1.3rem", fontWeight: "800", background: "linear-gradient(135deg, #fff 40%, #1dbf73)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px" }}>
            SkillBridge
          </span>
        </Link>

        {/* ── Right side ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          {/* ── Mode Banner (when logged in) ── */}
          {isAuthenticated && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 4px 5px 10px", background: "rgba(255,255,255,0.04)", border: "1px solid #2a2a3a", borderRadius: "30px" }}>
              {/* Mode label */}
              <span style={{ fontSize: "0.8rem", color: mode === "seller" ? "#1dbf73" : "#9090b0", fontWeight: "600", transition: "color 0.2s", userSelect: "none" }}>
                {mode === "seller" ? "🏷️ Seller" : "🛒 Buyer"}
              </span>

              {/* Toggle pill — only clickable if isSeller */}
              <button
                id="mode-toggle"
                onClick={handleModeToggle}
                title={isSeller ? (mode === "buyer" ? "Switch to Seller mode" : "Switch to Buyer mode") : "Become a seller to unlock"}
                style={{
                  position: "relative",
                  width: "46px", height: "24px",
                  background: mode === "seller" ? "linear-gradient(135deg, #1dbf73, #0a9d5a)" : "#2a2a3a",
                  borderRadius: "12px", border: "none",
                  cursor: isSeller ? "pointer" : "not-allowed",
                  transition: "background 0.3s",
                  padding: 0,
                  opacity: isSeller ? 1 : 0.5,
                }}
              >
                <span style={{
                  position: "absolute",
                  top: "3px",
                  left: mode === "seller" ? "25px" : "3px",
                  width: "18px", height: "18px",
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.25s cubic-bezier(.4,0,.2,1)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  pointerEvents: "none",
                }} />
              </button>
            </div>
          )}

          {/* Home link */}
          <Link
            to="/"
            style={{
              padding: "9px 18px", borderRadius: "8px", fontWeight: "500",
              fontSize: "0.9rem",
              color: location.pathname === "/" ? "#1dbf73" : "#c0c0d8",
              background: location.pathname === "/" ? "rgba(29,191,115,0.1)" : "transparent",
              transition: "all 0.2s", textDecoration: "none",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#1dbf73"; e.currentTarget.style.background = "rgba(29,191,115,0.08)"; }}
            onMouseLeave={e => {
              e.currentTarget.style.color = location.pathname === "/" ? "#1dbf73" : "#c0c0d8";
              e.currentTarget.style.background = location.pathname === "/" ? "rgba(29,191,115,0.1)" : "transparent";
            }}
          >
            Home
          </Link>

          {/* ================================================================= */}
          {/* AUTHENTICATED */}
          {/* ================================================================= */}
          {isAuthenticated ? (
            <>
              {/* Seller: Post a Gig */}
              {isSeller && mode === "seller" && (
                <Link
                  to="/add-gig"
                  style={{
                    padding: "9px 18px", borderRadius: "8px", fontWeight: "600",
                    fontSize: "0.9rem", color: "#c0c0d8",
                    border: "1px solid #2a2a3a",
                    transition: "all 0.2s", textDecoration: "none",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#1dbf73"; e.currentTarget.style.color = "#1dbf73"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a3a"; e.currentTarget.style.color = "#c0c0d8"; }}
                >
                  + Post a Gig
                </Link>
              )}

              {/* ── Avatar + Dropdown ── */}
              <div ref={dropRef} style={{ position: "relative" }}>
                <button
                  id="navbar-avatar"
                  onClick={() => { setDropdown(!dropdownOpen); setActivateErr(""); }}
                  style={{
                    width: "38px", height: "38px", borderRadius: "10px",
                    background: mode === "seller"
                      ? "linear-gradient(135deg, #1dbf73, #0a9d5a)"
                      : "linear-gradient(135deg, #6366f1, #4f46e5)",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", fontWeight: "700", color: "#fff",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: dropdownOpen ? "0 6px 20px rgba(99,102,241,0.5)" : "none",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.username}
                      style={{ width: "100%", height: "100%", borderRadius: "10px", objectFit: "cover" }}
                    />
                  ) : (
                    initials
                  )}
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute", top: "calc(100% + 10px)", right: 0,
                      background: "rgba(13,13,19,0.98)", border: "1px solid #2a2a3a",
                      borderRadius: "16px", padding: "8px", minWidth: "220px",
                      boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
                      backdropFilter: "blur(24px)", zIndex: 200,
                      animation: "dropIn 0.15s ease",
                    }}
                  >
                    {/* User info header */}
                    <div style={{ padding: "10px 14px 12px", borderBottom: "1px solid #1e1e2e", marginBottom: "6px" }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#e8e8f0" }}>{user?.username}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b6b8a", marginTop: "2px" }}>
                        {isSeller ? (mode === "seller" ? "🏷️ Seller Mode" : "🛒 Buyer Mode") : "🛒 Buyer"}
                      </div>
                    </div>

                    {/* ── Mode toggle row (sellers only) ── */}
                    {isSeller && (
                      <div
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "10px 14px", margin: "4px 0",
                          background: "rgba(29,191,115,0.05)", borderRadius: "10px",
                          border: "1px solid rgba(29,191,115,0.1)",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "0.82rem", fontWeight: "600", color: "#c0c0d8" }}>
                            {mode === "buyer" ? "Switch to Seller" : "Switch to Buyer"}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "#6b6b8a", marginTop: "1px" }}>
                            {mode === "buyer" ? "Manage your gigs" : "Browse & order gigs"}
                          </div>
                        </div>
                        <button
                          onClick={handleModeToggle}
                          style={{
                            position: "relative", width: "46px", height: "24px",
                            background: mode === "seller"
                              ? "linear-gradient(135deg, #1dbf73, #0a9d5a)"
                              : "#2a2a3a",
                            borderRadius: "12px", border: "none",
                            cursor: "pointer", transition: "background 0.3s", padding: 0,
                          }}
                        >
                          <span style={{
                            position: "absolute", top: "3px", width: "18px", height: "18px",
                            left: mode === "seller" ? "25px" : "3px",
                            borderRadius: "50%", background: "#fff",
                            transition: "left 0.25s cubic-bezier(.4,0,.2,1)",
                            pointerEvents: "none",
                          }} />
                        </button>
                      </div>
                    )}

                    {/* ── Become a Seller ── (only if not yet a seller) */}
                    {!isSeller && (
                      <div style={{ padding: "6px 0", borderBottom: "1px solid #1e1e2e", marginBottom: "6px" }}>
                        {activateErr && (
                          <div style={{ padding: "6px 12px", color: "#f87171", fontSize: "0.75rem", marginBottom: "4px" }}>
                            {activateErr}
                          </div>
                        )}
                        <button
                          id="become-seller-btn"
                          onClick={handleBecomeSeller}
                          disabled={activating}
                          style={{
                            ...dropItemStyle,
                            padding: "10px 14px",
                            background: activating ? "rgba(29,191,115,0.05)" : "rgba(29,191,115,0.08)",
                            border: "1px solid rgba(29,191,115,0.2)",
                            borderRadius: "10px",
                            color: "#1dbf73",
                            fontWeight: "600",
                            width: "100%",
                            opacity: activating ? 0.7 : 1,
                            cursor: activating ? "not-allowed" : "pointer",
                          }}
                        >
                          <span>{activating ? "⏳" : "🚀"}</span>
                          {activating ? "Activating…" : "Become a Seller"}
                        </button>
                      </div>
                    )}

                    {/* ── Seller Dashboard ── */}
                    {isSeller && mode === "seller" && (
                      <Link
                        to="/seller-dashboard"
                        onClick={() => setDropdown(false)}
                        style={dropItemStyle}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(29,191,115,0.08)"; e.currentTarget.style.color = "#1dbf73"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c0c0d8"; }}
                      >
                        <span>📊</span> Seller Dashboard
                      </Link>
                    )}

                    {/* ── Admin Dashboard (admin only) ── */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdown(false)}
                        style={{
                          ...dropItemStyle,
                          background: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.2)",
                          borderRadius: "10px",
                          color: "#f87171",
                          fontWeight: "600",
                          marginBottom: "6px",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#fca5a5"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#f87171"; }}
                      >
                        <span>🛡️</span> Admin Dashboard
                      </Link>
                    )}

                    {/* ── Standard links ── */}
                    {[
                      { label: "Profile", icon: "👤", path: "/profile" },
                      { label: "My Orders", icon: "📋", path: "/orders" },
                      ...(isSeller ? [{ label: "My Gigs", icon: "💼", path: "/my-gigs" }] : []),
                    ].map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setDropdown(false)}
                        style={dropItemStyle}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#e8e8f0"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c0c0d8"; }}
                      >
                        <span>{item.icon}</span> {item.label}
                      </Link>
                    ))}

                    {/* ── Logout ── */}
                    <div style={{ borderTop: "1px solid #1e1e2e", marginTop: "6px", paddingTop: "6px" }}>
                      <button
                        id="navbar-logout"
                        onClick={handleLogout}
                        style={{ ...dropItemStyle, color: "#f87171" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span>🚪</span> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>

          ) : (
            /* ─────────── GUEST ─────────── */
            <>
              {/* "Become a Seller" promo link for guests */}
              <a
                href="/register"
                style={{
                  padding: "9px 18px", borderRadius: "8px",
                  fontWeight: "500", fontSize: "0.85rem", color: "#9090b0",
                  transition: "color 0.2s", textDecoration: "none",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#1dbf73"}
                onMouseLeave={e => e.currentTarget.style.color = "#9090b0"}
              >
                Become a Seller
              </a>

              <Link to="/login" style={{
                padding: "9px 18px", borderRadius: "8px", fontWeight: "500",
                fontSize: "0.9rem",
                color: location.pathname === "/login" ? "#1dbf73" : "#c0c0d8",
                background: location.pathname === "/login" ? "rgba(29,191,115,0.1)" : "transparent",
                transition: "all 0.2s", textDecoration: "none",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = "#1dbf73"; e.currentTarget.style.background = "rgba(29,191,115,0.08)"; }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = location.pathname === "/login" ? "#1dbf73" : "#c0c0d8";
                  e.currentTarget.style.background = location.pathname === "/login" ? "rgba(29,191,115,0.1)" : "transparent";
                }}>
                Login
              </Link>

              <Link to="/register" style={{
                padding: "9px 22px", borderRadius: "8px", fontWeight: "600",
                fontSize: "0.9rem", background: "linear-gradient(135deg, #1dbf73, #0a9d5a)",
                color: "#fff", transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 15px rgba(29,191,115,0.35)", textDecoration: "none",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </nav>
  );
}
