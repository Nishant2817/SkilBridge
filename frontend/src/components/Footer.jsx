import { Link } from "react-router-dom";

const footerLinks = {
  Company: ["About Us", "Press", "Careers", "Blog"],
  Support: ["Help Center", "Trust & Safety", "Community"],
  Legal: ["Terms of Service", "Privacy Policy", "Cookie Settings"],
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0d0d16",
        borderTop: "1px solid #1e1e2e",
        padding: "60px 2rem 30px",
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Top grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "40px",
            marginBottom: "48px",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  background: "linear-gradient(135deg, #1dbf73, #0a9d5a)",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "800",
                  color: "#fff",
                  fontSize: "15px",
                }}
              >
                F
              </div>
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "800",
                  background: "linear-gradient(135deg, #fff 40%, #1dbf73)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                FreelanceHub
              </span>
            </div>
            <p style={{ color: "#6b6b8a", fontSize: "0.9rem", lineHeight: "1.7", maxWidth: "260px" }}>
              The marketplace for digital services. Connecting talented freelancers with businesses worldwide.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ color: "#e0e0f0", fontWeight: "600", marginBottom: "16px", fontSize: "0.95rem" }}>
                {title}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        color: "#6b6b8a",
                        fontSize: "0.875rem",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = "#1dbf73"}
                      onMouseLeave={e => e.currentTarget.style.color = "#6b6b8a"}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid #1e1e2e",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p style={{ color: "#4a4a6a", fontSize: "0.85rem" }}>
            © {new Date().getFullYear()} FreelanceHub. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a
                key={social}
                href="#"
                style={{
                  color: "#4a4a6a",
                  fontSize: "0.85rem",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#1dbf73"}
                onMouseLeave={e => e.currentTarget.style.color = "#4a4a6a"}
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
