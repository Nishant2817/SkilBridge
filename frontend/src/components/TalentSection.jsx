import { useNavigate } from "react-router-dom";

const benefits = [
  {
    title: "Save budget",
    desc: "Find high-quality services at every price point.",
  },
  {
    title: "Completed quickly",
    desc: "Find the right freelancer for your project within minutes.",
  },
  {
    title: "Safe and secure",
    desc: "We always protect your data and privacy.",
  },
  {
    title: "24/7 support",
    desc: "Our 24/7 support team is ready to help anytime, anywhere.",
  },
];

export default function TalentSection() {
  const navigate = useNavigate();

  return (
    <section style={{ background: "#f8f9fa", padding: "80px 2rem", borderTop: "1px solid #f0f0f0" }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        gap: 80,
      }}>
        {/* Left illustration */}
        <div style={{
          flex: "0 0 380px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          {/* Decorative stars/elements */}
          <div style={{ position: "absolute", top: "5%", left: "10%", fontSize: 18, color: "#222" }}>★</div>
          <div style={{ position: "absolute", top: "15%", right: "15%", fontSize: 12, color: "#222" }}>✦</div>
          <div style={{ position: "absolute", bottom: "10%", left: "5%", fontSize: 14, color: "#222" }}>★</div>
          {/* Sun icon */}
          <div style={{
            position: "absolute",
            top: "30%",
            left: "5%",
            width: 28,
            height: 28,
          }}>
            <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="6" stroke="#222" strokeWidth="2"/>
              <line x1="14" y1="2" x2="14" y2="6" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
              <line x1="14" y1="22" x2="14" y2="26" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
              <line x1="2" y1="14" x2="6" y2="14" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
              <line x1="22" y1="14" x2="26" y2="14" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          <img
            src="/talent-illustration.png"
            alt="Freelance talent at your fingertips"
            style={{
              width: "100%",
              maxWidth: 360,
              objectFit: "contain",
              filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.1))",
            }}
            onError={(e) => {
              // Fallback inline SVG when image is missing
              e.target.style.display = "none";
            }}
          />

          {/* Decorative green squiggles */}
          <div style={{ position: "absolute", bottom: "15%", right: "5%" }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M5 20 Q10 10 15 20 Q20 30 25 20 Q30 10 35 20" stroke="#1dbf73" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <path d="M5 30 Q10 20 15 30 Q20 40 25 30" stroke="#1dbf73" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
            </svg>
          </div>
        </div>

        {/* Right content */}
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            color: "#1a1a2e",
            letterSpacing: "-0.5px",
            lineHeight: 1.25,
            marginBottom: 32,
            maxWidth: 420,
          }}>
            A whole world of freelance talent at your fingertips
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {benefits.map((b) => (
              <div key={b.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "transparent",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 2,
                }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 9 L7 13 L15 5" stroke="#1dbf73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.95rem", marginBottom: 3 }}>
                    {b.title}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "0.875rem", lineHeight: 1.5 }}>
                    {b.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/gigs")}
            style={{
              marginTop: 36,
              padding: "13px 32px",
              background: "#1dbf73",
              color: "#fff",
              border: "none",
              borderRadius: 50,
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit",
              boxShadow: "0 4px 20px rgba(29,191,115,0.35)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#17a862"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#1dbf73"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Get Start
          </button>
        </div>
      </div>
    </section>
  );
}
