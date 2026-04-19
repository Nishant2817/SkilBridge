import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  "All Categories",
  "Design",
  "Development",
  "Marketing",
  "Writing",
  "Video",
  "Music",
  "Business",
  "Data",
];

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [catOpen, setCatOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (selectedCategory !== "All Categories") params.set("category", selectedCategory);
    navigate(`/gigs?${params.toString()}`);
  };

  const handleSuggestionClick = (s) => {
    navigate(`/gigs?search=${encodeURIComponent(s)}`);
  };

  const suggestions = ["Logo Design", "WordPress", "Voice Over", "Video Editing", "SEO"];

  return (
    <section style={{
      background: "linear-gradient(135deg, #c9a8a0 0%, #b8907e 40%, #c3988a 100%)",
      /* ── FIX 1: Full viewport height so the pink fills the entire screen ── */
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
      /* ── FIX 2: paddingTop = navbar height so content isn't hidden under it ── */
      paddingTop: 66,
    }}>

      {/* ── Decorative ambient shapes ── */}
      <div style={{ position:"absolute", top:"10%",  left:"4%",  width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.055)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"8%", left:"18%", width:130, height:130, borderRadius:"50%", background:"rgba(255,255,255,0.04)",  pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"15%",  right:"8%",  width:8,  height:8,  borderRadius:"50%", background:"rgba(255,255,255,0.55)" }} />
      <div style={{ position:"absolute", top:"28%",  right:"24%", width:6,  height:6,  borderRadius:"50%", background:"rgba(255,255,255,0.45)" }} />
      <div style={{ position:"absolute", top:"42%",  right:"37%", width:10, height:10, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.38)", background:"transparent" }} />
      <div style={{ position:"absolute", top:"62%",  right:"29%", fontSize:14, color:"rgba(255,255,255,0.4)" }}>〜</div>
      <div style={{ position:"absolute", top:"22%",  right:"41%", fontSize:12, color:"rgba(255,255,255,0.35)" }}>▾</div>
      <div style={{ position:"absolute", bottom:"22%",right:"19%", fontSize:16, color:"rgba(255,255,255,0.35)" }}>◇</div>
      <div style={{ position:"absolute", bottom:"15%",right:"42%", fontSize:10, color:"rgba(255,255,255,0.3)" }}>✦</div>

      {/* ── Main row ── */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: 40,
      }}>

        {/* ────────── LEFT CONTENT ────────── */}
        <div style={{ flex: 1, zIndex: 2, paddingBottom: 48 }}>

          <h1 style={{
            fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
            fontWeight: 900,
            color: "#1a1a1a",
            lineHeight: 1.15,
            letterSpacing: "-1.5px",
            marginBottom: 14,
            fontFamily: "'Inter', sans-serif",
          }}>
            Scale quickly with<br />
            professional freelancers
          </h1>

          <p style={{ color: "#3d2c28", fontSize: "1.05rem", marginBottom: 32, opacity: 0.8, fontWeight: 400 }}>
            Over 1200+ expect freelancers are waiting for you
          </p>

          {/* ── Search bar ── */}
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: 50,
              boxShadow: "0 6px 32px rgba(0,0,0,0.16)",
              maxWidth: 540,
              position: "relative",
              overflow: "visible",
            }}
          >
            {/* Search icon + text input */}
            <div style={{ display:"flex", alignItems:"center", flex:1, padding:"0 16px", gap:8 }}>
              <svg width="17" height="17" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Service title..."
                style={{
                  border:"none", outline:"none", flex:1,
                  fontSize:"0.95rem", color:"#1a1a1a",
                  padding:"14px 0", background:"transparent",
                  fontFamily:"inherit",
                }}
              />
            </div>

            {/* Divider */}
            <div style={{ width:1, height:26, background:"#e5e7eb", flexShrink:0 }} />

            {/* Category picker */}
            <div style={{ position:"relative" }}>
              <button
                type="button"
                onClick={() => setCatOpen(!catOpen)}
                style={{
                  display:"flex", alignItems:"center", gap:6,
                  padding:"14px 14px", background:"transparent",
                  border:"none", cursor:"pointer",
                  fontSize:"0.85rem", color:"#555",
                  whiteSpace:"nowrap", fontFamily:"inherit",
                }}
              >
                <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                {selectedCategory}
                <svg width="11" height="11" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round"/>
                </svg>
              </button>

              {catOpen && (
                <div style={{
                  position:"absolute", top:"calc(100% + 6px)", right:0,
                  background:"#fff", borderRadius:12,
                  boxShadow:"0 12px 40px rgba(0,0,0,0.14)",
                  border:"1px solid #f0f0f0",
                  minWidth:185, zIndex:200, overflow:"hidden",
                }}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => { setSelectedCategory(cat); setCatOpen(false); }}
                      style={{
                        display:"block", width:"100%",
                        padding:"9px 16px", textAlign:"left",
                        background: selectedCategory === cat ? "#f0fdf8" : "transparent",
                        border:"none", cursor:"pointer",
                        fontSize:"0.875rem",
                        color: selectedCategory === cat ? "#1dbf73" : "#374151",
                        fontFamily:"inherit", transition:"background 0.15s",
                      }}
                      onMouseEnter={(e) => { if (selectedCategory !== cat) e.currentTarget.style.background = "#f9fafb"; }}
                      onMouseLeave={(e) => { if (selectedCategory !== cat) e.currentTarget.style.background = "transparent"; }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search CTA */}
            <button
              type="submit"
              style={{
                background:"#1dbf73", color:"#fff",
                border:"none", borderRadius:50,
                padding:"13px 28px", fontWeight:700,
                fontSize:"0.95rem", cursor:"pointer",
                margin:4, whiteSpace:"nowrap",
                fontFamily:"inherit",
                transition:"background 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background="#17a862"; e.currentTarget.style.transform="scale(1.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background="#1dbf73"; e.currentTarget.style.transform="scale(1)"; }}
            >
              Search
            </button>
          </form>

          {/* Popular suggestion pills */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:20, flexWrap:"wrap" }}>
            <span style={{ color:"rgba(70,40,30,0.65)", fontSize:"0.85rem", fontWeight:500 }}>Popular:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestionClick(s)}
                style={{
                  padding:"5px 14px", borderRadius:50,
                  border:"1px solid rgba(255,255,255,0.65)",
                  background:"rgba(255,255,255,0.28)",
                  color:"#3d2c28", fontSize:"0.82rem",
                  cursor:"pointer", backdropFilter:"blur(4px)",
                  transition:"background 0.2s", fontFamily:"inherit",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.55)"}
                onMouseLeave={(e) => e.currentTarget.style.background="rgba(255,255,255,0.28)"}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ────────── RIGHT ILLUSTRATION ────────── */}
        {/*
          FIX 3: mix-blend-mode:"multiply" makes the PNG's white background
          transparent against the pink section — no more white box!
          alignSelf:"flex-end" pins the image to the bottom of the hero.
        */}
        <div style={{
          flex:"0 0 440px",
          display:"flex",
          alignItems:"flex-end",
          justifyContent:"center",
          alignSelf:"flex-end",
          position:"relative",
          zIndex:2,
          mixBlendMode: "multiply",
        }}>
          <img
            src="/hero-illustration.png"
            alt="Freelancer working on laptop"
            style={{
              width: "100%",
              maxWidth: 440,
              objectFit: "contain",
              display: "block",
            }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
      </div>
    </section>
  );
}
