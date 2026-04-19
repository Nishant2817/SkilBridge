import { Link } from "react-router-dom";

const freelancers = [
  {
    id: 1,
    name: "David Tho",
    role: "Designer",
    location: "Ab e Kamari",
    rating: 5.0,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    bio: "Do you need a professional, branded and aesthetic looking shopify ecommerce website or landing page built with shogun, pagefly, gempages and zipify? I will design a stunning shopify ecommerce website or shopify...",
    skills: ["Figma Design", "Product Manager", "Sketch", "UI/UX Design"],
    price: "$3,000/month",
  },
  {
    id: 2,
    name: "Kevin Ble",
    role: "Developer",
    location: "California",
    rating: 5.0,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    bio: "Detail oriented work is a must in my book and you will get a high-quality product from me. Please invite me to discuss how my skills fit your posting, how...",
    skills: ["Figma Design", "FrontEnd Developer", "Sketch", "UI/UX Design"],
    price: "$1,000/month",
  },
  {
    id: 3,
    name: "Kianna Ble",
    role: "Customer Service",
    location: "Chicago",
    rating: 3.3,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    bio: "An English Native with a passion for words! My love for writing, editing, proofreading, and content creating has translated to my career. I have a bachelor's degree in Converged Broadcast...",
    skills: ["Customer Support", "Supporter", "Techical Support"],
    price: "$25/day",
  },
];

const roleColors = {
  "Designer": "#1dbf73",
  "Developer": "#1dbf73",
  "Customer Service": "#1dbf73",
};

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const partial = rating % 1;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ fontSize: 13, color: i < full ? "#fbbf24" : partial > 0 && i === full ? "#fbbf24" : "#d1d5db" }}>
          ★
        </span>
      ))}
      <span style={{ fontSize: "0.8rem", color: "#6b7280", marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </span>
  );
}

export default function TopFreelancers() {
  return (
    <section style={{ background: "#fffdf0", padding: "80px 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 10 }}>
            <span style={{ fontSize: "2rem" }}>⭐</span>
            <h2 style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "#1a1a2e",
              letterSpacing: "-0.5px",
            }}>
              Top rated freelancer
            </h2>
            <span style={{ fontSize: "2rem" }}>😍</span>
          </div>
          <p style={{ color: "#6b7280", fontSize: "1rem" }}>
            Top rated freelancer of the week
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {freelancers.map((f) => (
            <div
              key={f.id}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                border: "1px solid #f0f0f0",
                transition: "all 0.25s ease",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Top Row: Avatar + View Profile button */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <img
                  src={f.avatar}
                  alt={f.name}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #f0f0f0",
                  }}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=1dbf73&color=fff&size=56`;
                  }}
                />
                <Link
                  to="/gigs"
                  style={{
                    padding: "8px 18px",
                    border: "1.5px solid #1dbf73",
                    borderRadius: 50,
                    color: "#1dbf73",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1dbf73"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1dbf73"; }}
                >
                  View Profile
                </Link>
              </div>

              {/* Name + Meta */}
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1a1a2e", marginBottom: 4 }}>{f.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ color: roleColors[f.role] || "#1dbf73", fontSize: "0.8rem", fontWeight: 600 }}>
                    {f.role}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 3, color: "#6b7280", fontSize: "0.78rem" }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                    {f.location}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <span style={{ color: "#fbbf24", fontSize: 13 }}>★</span>
                    <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>{f.rating.toFixed(1)}</span>
                  </span>
                </div>
              </div>

              {/* Bio */}
              <p style={{
                color: "#4b5563",
                fontSize: "0.85rem",
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {f.bio}
              </p>

              {/* Skills Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {f.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 50,
                      border: "1px solid #e5e7eb",
                      fontSize: "0.75rem",
                      color: "#374151",
                      background: "#f9fafb",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Price */}
              <div style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#1a1a2e",
                borderTop: "1px solid #f0f0f0",
                paddingTop: 12,
                marginTop: 4,
              }}>
                {f.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
