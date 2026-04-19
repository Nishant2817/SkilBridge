import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import CategoriesSection from "../components/CategoriesSection";
import FeaturedGigs from "../components/FeaturedGigs";
import { useAuth } from "../context/AuthContext";

const stats = [
  { label: "Active freelancers", value: "50K+" },
  { label: "Projects completed", value: "2M+" },
  { label: "Happy clients", value: "500K+" },
  { label: "Countries served", value: "180+" },
];

export default function Home() {
  const { isAuthenticated, mode, isSeller } = useAuth();

  const ctaHeading = isAuthenticated && isSeller && mode === "seller"
    ? "Your seller dashboard awaits"
    : isAuthenticated
      ? "Find your next great hire"
      : "Start your journey today";

  const ctaSub = isAuthenticated && isSeller && mode === "seller"
    ? "Manage gigs, track orders, and grow your freelance business."
    : isAuthenticated
      ? "Discover top freelancers trusted by thousands of businesses."
      : "Join millions of businesses and freelancers who trust SkillBridge.";

  return (
    <>
      <HeroSection />

      {/* Stats bar */}
      <div style={{ background: "#111120", borderTop: "1px solid #1e1e2e", borderBottom: "1px solid #1e1e2e", padding: "32px 2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", textAlign: "center" }}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: "2rem", fontWeight: "900", background: "linear-gradient(135deg, #1dbf73, #57e6a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-1px", marginBottom: "4px" }}>
                {stat.value}
              </div>
              <div style={{ color: "#6b6b8a", fontSize: "0.875rem" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <CategoriesSection />
      <FeaturedGigs />

      {/* ── Mode-aware CTA Section ── */}
      <section style={{ padding: "100px 2rem", background: "linear-gradient(135deg, #0d1a12 0%, #0a0a0f 50%, #14101f 100%)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "400px", background: "radial-gradient(circle, rgba(29,191,115,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "900", color: "#e8e8f0", letterSpacing: "-1.5px", marginBottom: "16px" }}>
            {ctaHeading}
          </h2>
          <p style={{ color: "#8888a8", fontSize: "1.1rem", marginBottom: "36px", maxWidth: "500px", margin: "0 auto 36px" }}>
            {ctaSub}
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            {isAuthenticated && isSeller && mode === "seller" ? (
              /* Seller CTA */
              <Link to="/seller-dashboard"
                style={{ padding: "15px 36px", background: "linear-gradient(135deg, #1dbf73, #0a9d5a)", color: "#fff", borderRadius: "14px", fontWeight: "700", fontSize: "1rem", boxShadow: "0 8px 30px rgba(29,191,115,0.4)", transition: "transform 0.2s, box-shadow 0.2s", display: "inline-block", textDecoration: "none" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(29,191,115,0.6)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(29,191,115,0.4)"; }}
              >
                Go to Dashboard →
              </Link>
            ) : isAuthenticated ? (
              /* Buyer CTA */
              <Link to="/#featured"
                style={{ padding: "15px 36px", background: "linear-gradient(135deg, #1dbf73, #0a9d5a)", color: "#fff", borderRadius: "14px", fontWeight: "700", fontSize: "1rem", boxShadow: "0 8px 30px rgba(29,191,115,0.4)", transition: "transform 0.2s, box-shadow 0.2s", display: "inline-block", textDecoration: "none" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(29,191,115,0.6)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(29,191,115,0.4)"; }}
              >
                Browse Gigs
              </Link>
            ) : (
              /* Guest CTAs */
              <>
                <a href="/register"
                  style={{ padding: "15px 36px", background: "linear-gradient(135deg, #1dbf73, #0a9d5a)", color: "#fff", borderRadius: "14px", fontWeight: "700", fontSize: "1rem", boxShadow: "0 8px 30px rgba(29,191,115,0.4)", transition: "transform 0.2s, box-shadow 0.2s", display: "inline-block", textDecoration: "none" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(29,191,115,0.6)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(29,191,115,0.4)"; }}
                >
                  Get Started Free
                </a>
                <a href="/login"
                  style={{ padding: "15px 36px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#c0c0d8", borderRadius: "14px", fontWeight: "600", fontSize: "1rem", transition: "all 0.2s", display: "inline-block", textDecoration: "none" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#c0c0d8"; }}
                >
                  Sign In
                </a>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

