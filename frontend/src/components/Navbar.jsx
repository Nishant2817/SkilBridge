import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { becomeSeller } from "../api/users";

/* ─────────────────────────────────────────────
   Animated Sticker Logo  (like "Civi" branding)
   • Dark "S" letter on white pill background
   • A small glowing dot orbits the S on an
     elliptical path, giving a planet/ring feel
   • Smooth CSS animation, no library needed
───────────────────────────────────────────── */
function AnimatedLogo() {
  return (
    <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
      {/* ── Sticker badge ── */}
      <div className="logo-sticker" style={{ position: "relative", width: 38, height: 38 }}>
        {/* Outer glow ring */}
        <div style={{
          position: "absolute", inset: -2,
          borderRadius: "50%",
          background: "conic-gradient(from 0deg, #1dbf73, #a7f3d0, #1dbf73)",
          animation: "spin-ring 3s linear infinite",
          zIndex: 0,
        }} />
        {/* White background disc */}
        <div style={{
          position: "absolute", inset: 2,
          borderRadius: "50%",
          background: "#fff",
          zIndex: 1,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontSize: "1.05rem", fontWeight: 900,
            color: "#dcdee3ff",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "-0.5px",
            lineHeight: 1,
          }}>
            S
          </span>
        </div>
        {/* Orbiting dot */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: 7, height: 7,
          marginTop: -3.5, marginLeft: -3.5,
          zIndex: 2,
          animation: "orbit-dot 2.4s linear infinite",
          transformOrigin: "0 0",
        }}>
          <div style={{
            width: 7, height: 7,
            borderRadius: "50%",
            background: "#1dbf73",
            boxShadow: "0 0 6px 2px rgba(29,191,115,0.7)",
          }} />
        </div>
      </div>

      {/* ── Wordmark ── */}
      <span style={{
        fontSize: "1.2rem", fontWeight: 800,
        color: "#111827",
        letterSpacing: "-0.4px",
        fontFamily: "'Inter', sans-serif",
      }}>
        Skill<span style={{ color: "#1dbf73" }}>Bridge</span>
      </span>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Chevron icon for dropdowns
───────────────────────────────────────────── */
function ChevronDown({ size = 14 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Main Navbar
───────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdown] = useState(false);
  const [activating, setActivating] = useState(false);
  const [activateErr, setActivateErr] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dropRef = useRef(null);

  const {
    isAuthenticated, user, token,
    mode, setMode, logout,
    activateSeller, isSeller, isAdmin,
    openAuthModal,
  } = useAuth();

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close avatar dropdown on outside click */
  useEffect(() => {
    const h = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdown(false);
        setActivateErr("");
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* close mobile menu on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); setDropdown(false); navigate("/"); };

  const handleBecomeSeller = async () => {
    setActivateErr(""); setActivating(true);
    try {
      const { user: u } = await becomeSeller(token);
      activateSeller(u); setDropdown(false);
    } catch (err) { setActivateErr(err.message); }
    finally { setActivating(false); }
  };

  const handleModeToggle = () => {
    if (!isSeller) return;
    setMode(mode === "buyer" ? "seller" : "buyer");
  };

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "??";

  /* nav link helper */
  const isActive = (path) => location.pathname === path;

  /* shared dropdown item style */
  const dropItem = {
    display: "flex", alignItems: "center", gap: 10,
    padding: "9px 12px", borderRadius: 8,
    color: "#374151", fontSize: "0.875rem", fontWeight: 500,
    textDecoration: "none", background: "none", border: "none",
    width: "100%", textAlign: "left", cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
    fontFamily: "inherit",
  };

  return (
    <>
      {/* ── Keyframe animations injected once ── */}
      <style>{`
        @keyframes spin-ring {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbit-dot {
          from { transform: rotate(0deg)   translateX(19px) rotate(0deg);   }
          to   { transform: rotate(360deg) translateX(19px) rotate(-360deg);}
        }
        @keyframes dropIn {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        .nav-link {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 7px 13px; border-radius: 8px;
          font-size: 0.875rem; font-weight: 500;
          color: #374151; text-decoration: none;
          transition: background 0.18s, color 0.18s;
          white-space: nowrap; cursor: pointer;
          background: none; border: none; font-family: inherit;
        }
        .nav-link:hover, .nav-link.active {
          background: #f3f4f6; color: #111827;
        }
        .drop-item:hover {
          background: #f3f4f6 !important; color: #111827 !important;
        }
        .drop-item-green:hover {
          background: rgba(29,191,115,0.08) !important; color: #059669 !important;
        }
        .drop-item-red:hover {
          background: rgba(239,68,68,0.08) !important; color: #dc2626 !important;
        }
        /* Toggle track */
        .mode-track {
          position:relative; width:44px; height:23px;
          border-radius:12px; border:none; cursor:pointer; padding:0;
          transition: background 0.3s;
        }
        .mode-thumb {
          position:absolute; top:2.5px; width:18px; height:18px;
          border-radius:50%; background:#fff;
          transition: left 0.25s cubic-bezier(.4,0,.2,1);
          pointer-events:none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "#ffffff",
        borderBottom: scrolled ? "1px solid #e5e7eb" : "1px solid #f3f4f6",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
        transition: "box-shadow 0.3s, border-color 0.3s",
        padding: "0 1.5rem",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 66,
          gap: 16,
        }}>

          {/* ── Logo ── */}
          <AnimatedLogo />

          {/* ── Centre nav links (desktop only) ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }}
            className="hide-mobile">

            <Link to="/" className={`nav-link${isActive("/") ? " active" : ""}`}>
              Home
            </Link>

            <Link to="/gigs" className={`nav-link${isActive("/gigs") ? " active" : ""}`}>
              Browse Gigs
            </Link>

            {isAuthenticated && isSeller && (
              <Link to="/seller-dashboard" className={`nav-link${isActive("/seller-dashboard") ? " active" : ""}`}>
                Dashboard
              </Link>
            )}

            {isAuthenticated && (
              <Link to="/orders" className={`nav-link${isActive("/orders") ? " active" : ""}`}>
                Orders
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className={`nav-link${isActive("/admin") ? " active" : ""}`}
                style={{ color: "#dc2626" }}>
                Admin
              </Link>
            )}
          </div>

          {/* ── Right side ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

            {/* ── Mode toggle pill (authenticated) ── */}
            {isAuthenticated && (
              <div style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "5px 10px 5px 12px",
                background: "#f9fafb", border: "1px solid #e5e7eb",
                borderRadius: 30,
              }} className="hide-mobile">
                <span style={{
                  fontSize: "0.78rem", fontWeight: 600,
                  color: mode === "seller" ? "#059669" : "#6b7280",
                  transition: "color 0.2s", userSelect: "none",
                }}>
                  {mode === "seller" ? "Seller" : "Buyer"}
                </span>
                <button
                  id="mode-toggle"
                  className="mode-track"
                  onClick={handleModeToggle}
                  title={isSeller ? (mode === "buyer" ? "Switch to Seller" : "Switch to Buyer") : "Become a seller to unlock"}
                  style={{
                    background: mode === "seller"
                      ? "linear-gradient(135deg,#1dbf73,#059669)"
                      : "#d1d5db",
                    opacity: isSeller ? 1 : 0.5,
                    cursor: isSeller ? "pointer" : "not-allowed",
                  }}
                >
                  <span className="mode-thumb" style={{ left: mode === "seller" ? "23px" : "2.5px" }} />
                </button>
              </div>
            )}

            {/* ── GUEST buttons ── */}
            {!isAuthenticated ? (
              <>
                <button onClick={() => openAuthModal("register")} style={{
                  padding: "7px 16px", borderRadius: 8,
                  fontWeight: 500, fontSize: "0.875rem",
                  color: "#374151", transition: "color 0.2s",
                  background: "none", border: "none", cursor: "pointer", fontFamily: "inherit"
                }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#059669"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#374151"}
                  className="hide-mobile">
                  Become a Seller
                </button>

                <button onClick={() => openAuthModal("login")} style={{
                  padding: "7px 16px", borderRadius: 8,
                  fontWeight: 500, fontSize: "0.875rem",
                  color: "#374151", textDecoration: "none",
                  transition: "background 0.18s",
                  background: "none", border: "none", cursor: "pointer", fontFamily: "inherit"
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  Login
                </button>

                {/* CTA — "Post a job" style */}
                <button onClick={() => openAuthModal("register")} style={{
                  padding: "9px 20px",
                  borderRadius: 50,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  background: "#111827",
                  color: "#fff",
                  textDecoration: "none",
                  transition: "background 0.2s, transform 0.2s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                  whiteSpace: "nowrap",
                  border: "none", cursor: "pointer", fontFamily: "inherit"
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1dbf73"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#111827"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  Post a Gig
                </button>
              </>
            ) : (
              <>
                {/* ── Post a Gig CTA for sellers ── */}
                {isSeller && mode === "seller" && (
                  <Link to="/add-gig" style={{
                    padding: "9px 20px", borderRadius: 50,
                    fontWeight: 700, fontSize: "0.875rem",
                    background: "#111827", color: "#fff",
                    textDecoration: "none",
                    transition: "background 0.2s, transform 0.2s",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                    whiteSpace: "nowrap",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#1dbf73"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#111827"; e.currentTarget.style.transform = "translateY(0)"; }}
                    className="hide-mobile">
                    + Post a Gig
                  </Link>
                )}

                {/* ── Avatar + Dropdown ── */}
                <div ref={dropRef} style={{ position: "relative" }}>
                  <button
                    id="navbar-avatar"
                    onClick={() => { setDropdown(!dropdownOpen); setActivateErr(""); }}
                    style={{
                      width: 38, height: 38, borderRadius: "50%",
                      border: "2px solid",
                      borderColor: dropdownOpen ? "#1dbf73" : "#e5e7eb",
                      cursor: "pointer", overflow: "hidden",
                      background: mode === "seller"
                        ? "linear-gradient(135deg,#1dbf73,#059669)"
                        : "linear-gradient(135deg,#6366f1,#4f46e5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.78rem", fontWeight: 700, color: "#fff",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      boxShadow: dropdownOpen ? "0 0 0 3px rgba(29,191,115,0.2)" : "none",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1dbf73"; }}
                    onMouseLeave={(e) => { if (!dropdownOpen) e.currentTarget.style.borderColor = "#e5e7eb"; }}
                  >
                    {user?.image ? (
                      <img src={user.image} alt={user.username}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : initials}
                  </button>

                  {/* ── Dropdown panel ── */}
                  {dropdownOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 10px)", right: 0,
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 16, padding: 8,
                      minWidth: 230,
                      boxShadow: "0 20px 50px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
                      zIndex: 200,
                      animation: "dropIn 0.15s ease",
                    }}>
                      {/* User header */}
                      <div style={{ padding: "10px 14px 12px", borderBottom: "1px solid #f3f4f6", marginBottom: 6 }}>
                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827" }}>
                          {user?.username}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>
                          {user?.email}
                        </div>
                        <span style={{
                          display: "inline-block", marginTop: 5,
                          padding: "2px 9px", borderRadius: 999,
                          fontSize: "0.7rem", fontWeight: 600,
                          background: mode === "seller" ? "rgba(29,191,115,0.1)" : "#f3f4f6",
                          color: mode === "seller" ? "#059669" : "#6b7280",
                          border: mode === "seller" ? "1px solid rgba(29,191,115,0.25)" : "1px solid #e5e7eb",
                        }}>
                          {isSeller ? (mode === "seller" ? "🏷️ Seller" : "🛒 Buyer") : "🛒 Buyer"}
                        </span>
                      </div>

                      {/* Mode toggle row (sellers) */}
                      {isSeller && (
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "10px 14px", margin: "4px 0",
                          background: "#f9fafb", borderRadius: 10,
                          border: "1px solid #e5e7eb",
                        }}>
                          <div>
                            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>
                              {mode === "buyer" ? "Switch to Seller" : "Switch to Buyer"}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: 1 }}>
                              {mode === "buyer" ? "Manage your gigs" : "Browse & order gigs"}
                            </div>
                          </div>
                          <button
                            className="mode-track"
                            onClick={handleModeToggle}
                            style={{
                              background: mode === "seller"
                                ? "linear-gradient(135deg,#1dbf73,#059669)"
                                : "#d1d5db",
                            }}
                          >
                            <span className="mode-thumb" style={{ left: mode === "seller" ? "23px" : "2.5px" }} />
                          </button>
                        </div>
                      )}

                      {/* Become a Seller */}
                      {!isSeller && (
                        <div style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: 6, marginBottom: 6 }}>
                          {activateErr && (
                            <div style={{ padding: "5px 12px", color: "#dc2626", fontSize: "0.72rem", marginBottom: 3 }}>
                              {activateErr}
                            </div>
                          )}
                          <button
                            id="become-seller-btn"
                            onClick={handleBecomeSeller}
                            disabled={activating}
                            className="drop-item drop-item-green"
                            style={{
                              ...dropItem,
                              background: "rgba(29,191,115,0.06)",
                              border: "1px solid rgba(29,191,115,0.18)",
                              borderRadius: 10,
                              color: "#059669",
                              fontWeight: 600,
                              opacity: activating ? 0.65 : 1,
                              cursor: activating ? "not-allowed" : "pointer",
                            }}
                          >
                            <span>{activating ? "⏳" : "🚀"}</span>
                            {activating ? "Activating…" : "Become a Seller"}
                          </button>
                        </div>
                      )}

                      {/* Seller Dashboard */}
                      {isSeller && mode === "seller" && (
                        <Link to="/seller-dashboard" onClick={() => setDropdown(false)}
                          className="drop-item" style={dropItem}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#111827"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#374151"; }}>
                          <span>📊</span> Seller Dashboard
                        </Link>
                      )}

                      {/* Admin */}
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setDropdown(false)}
                          style={{
                            ...dropItem,
                            background: "rgba(239,68,68,0.06)",
                            border: "1px solid rgba(239,68,68,0.18)",
                            borderRadius: 10, color: "#dc2626", fontWeight: 600,
                            marginBottom: 4,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}>
                          <span>🛡️</span> Admin Dashboard
                        </Link>
                      )}

                      {/* Standard links */}
                      {[
                        { label: "Profile", icon: "👤", path: "/profile" },
                        { label: "Messages", icon: "💬", path: "/messages" },
                        { label: "My Orders", icon: "📋", path: "/orders" },
                        ...(isSeller ? [{ label: "My Gigs", icon: "💼", path: "/my-gigs" }] : []),
                      ].map((item) => (
                        <Link key={item.path} to={item.path}
                          onClick={() => setDropdown(false)}
                          style={dropItem}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#111827"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#374151"; }}>
                          <span>{item.icon}</span> {item.label}
                        </Link>
                      ))}

                      {/* Logout */}
                      <div style={{ borderTop: "1px solid #f3f4f6", marginTop: 6, paddingTop: 6 }}>
                        <button id="navbar-logout" onClick={handleLogout}
                          style={{ ...dropItem, color: "#dc2626" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.07)"; e.currentTarget.style.color = "#b91c1c"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#dc2626"; }}>
                          <span>🚪</span> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── Mobile hamburger ── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: "none", alignItems: "center", justifyContent: "center",
                width: 38, height: 38, borderRadius: 8,
                border: "1px solid #e5e7eb", background: "none",
                cursor: "pointer", flexDirection: "column", gap: 4,
              }}
              className="show-mobile"
              aria-label="Toggle menu"
            >
              {["top", "mid", "bot"].map((k, i) => (
                <span key={k} style={{
                  display: "block", width: 18, height: 2, borderRadius: 2,
                  background: "#374151",
                  transition: "transform 0.2s",
                  transform: mobileOpen
                    ? i === 0 ? "translateY(6px) rotate(45deg)"
                      : i === 1 ? "scaleX(0)"
                        : "translateY(-6px) rotate(-45deg)"
                    : "none",
                }} />
              ))}
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div style={{
            borderTop: "1px solid #f3f4f6",
            padding: "12px 0 16px",
            display: "flex", flexDirection: "column", gap: 2,
            animation: "slideDown 0.2s ease",
          }}>
            {[
              { label: "Home", path: "/" },
              { label: "Browse Gigs", path: "/gigs" },
              ...(isAuthenticated ? [{ label: "Orders", path: "/orders" }] : []),
              ...(isAuthenticated && isSeller && mode === "seller"
                ? [{ label: "Dashboard", path: "/seller-dashboard" }] : []),
            ].map((item) => (
              <Link key={item.path} to={item.path}
                style={{
                  padding: "10px 16px", fontSize: "0.9rem",
                  fontWeight: isActive(item.path) ? 600 : 500,
                  color: isActive(item.path) ? "#059669" : "#374151",
                  textDecoration: "none",
                }}>
                {item.label}
              </Link>
            ))}

            {!isAuthenticated && (
              <div style={{ display: "flex", gap: 8, padding: "8px 16px 0" }}>
                <button onClick={() => openAuthModal("login")} style={{
                  flex: 1, padding: "9px 0", textAlign: "center",
                  border: "1px solid #e5e7eb", borderRadius: 8,
                  fontSize: "0.875rem", fontWeight: 500, color: "#374151",
                  background: "none", cursor: "pointer", fontFamily: "inherit"
                }}>Login</button>
                <button onClick={() => openAuthModal("register")} style={{
                  flex: 1, padding: "9px 0", textAlign: "center",
                  background: "#111827", borderRadius: 8,
                  fontSize: "0.875rem", fontWeight: 700, color: "#fff",
                  border: "none", cursor: "pointer", fontFamily: "inherit"
                }}>Register</button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ── Responsive utility styles ── */}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
