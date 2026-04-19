import { useNavigate } from "react-router-dom";

// SVG Illustrations for each category (inline, line-art style)
const CategoryIllustration = ({ type }) => {
  const illustrations = {
    "Design": (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 90, height: 90 }}>
        <rect x="15" y="30" width="55" height="60" rx="4" stroke="#222" strokeWidth="2.5" fill="none"/>
        <line x1="25" y1="45" x2="60" y2="45" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
        <line x1="25" y1="55" x2="50" y2="55" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="87" cy="50" r="18" stroke="#1dbf73" strokeWidth="2.5" fill="none"/>
        <path d="M80 50 L87 43 L94 50 L87 57 Z" stroke="#1dbf73" strokeWidth="2" fill="none"/>
        <circle cx="87" cy="50" r="4" fill="#1dbf73" opacity="0.6"/>
        <line x1="75" y1="55" x2="68" y2="62" stroke="#222" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="66" cy="64" r="3" stroke="#222" strokeWidth="2" fill="none"/>
      </svg>
    ),
    "Development": (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 90, height: 90 }}>
        <rect x="10" y="35" width="75" height="55" rx="6" stroke="#222" strokeWidth="2.5" fill="none"/>
        <rect x="10" y="35" width="75" height="12" rx="6" stroke="#222" strokeWidth="2.5" fill="#f5f5f5"/>
        <circle cx="20" cy="41" r="3" fill="#ff5f57"/>
        <circle cx="30" cy="41" r="3" fill="#febc2e"/>
        <circle cx="40" cy="41" r="3" fill="#28c840"/>
        <path d="M25 58 L18 65 L25 72" stroke="#1dbf73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M35 58 L42 65 L35 72" stroke="#1dbf73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="28" y1="72" x2="32" y2="58" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="95" cy="55" r="12" stroke="#222" strokeWidth="2" fill="none"/>
        <line x1="88" y1="62" x2="83" y2="67" stroke="#222" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    "Marketing": (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 90, height: 90 }}>
        <rect x="8" y="40" width="50" height="40" rx="5" stroke="#222" strokeWidth="2.5" fill="none"/>
        <path d="M18 60 L25 52 L33 63 L40 48 L50 60" stroke="#1dbf73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M75 30 L90 25 L85 55 L70 55 Z" stroke="#222" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
        <line x1="80" y1="55" x2="75" y2="70" stroke="#222" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="85" y1="55" x2="80" y2="70" stroke="#222" strokeWidth="2.5" strokeLinecap="round"/>
        <ellipse cx="68" cy="40" rx="4" ry="10" stroke="#1dbf73" strokeWidth="2" fill="none"/>
        <circle cx="88" cy="20" r="5" stroke="#222" strokeWidth="2" fill="none"/>
        <line x1="93" y1="15" x2="100" y2="10" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
        <line x1="93" y1="20" x2="100" y2="20" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
        <line x1="93" y1="25" x2="100" y2="30" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    "Writing": (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 90, height: 90 }}>
        <rect x="10" y="45" width="55" height="55" rx="4" stroke="#222" strokeWidth="2.5" fill="none"/>
        <rect x="22" y="30" width="55" height="55" rx="4" stroke="#222" strokeWidth="2.5" fill="white"/>
        <line x1="32" y1="48" x2="67" y2="48" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
        <line x1="32" y1="58" x2="67" y2="58" stroke="#1dbf73" strokeWidth="2" strokeLinecap="round"/>
        <line x1="32" y1="68" x2="55" y2="68" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
        <path d="M72 25 L80 33 L60 53 L52 45 Z" stroke="#222" strokeWidth="2" strokeLinejoin="round" fill="none"/>
        <line x1="52" y1="53" x2="52" y2="45" stroke="#222" strokeWidth="2"/>
        <line x1="68" y1="30" x2="77" y2="39" stroke="#222" strokeWidth="2"/>
      </svg>
    ),
    "Video": (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 90, height: 90 }}>
        <rect x="20" y="35" width="55" height="45" rx="5" stroke="#222" strokeWidth="2.5" fill="none"/>
        <polygon points="75,45 95,35 95,80 75,70" stroke="#222" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
        <circle cx="47" cy="57" r="10" stroke="#1dbf73" strokeWidth="2.5" fill="none"/>
        <polygon points="44,52 44,62 52,57" fill="#1dbf73"/>
      </svg>
    ),
    "Music": (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 90, height: 90 }}>
        <path d="M40 85 A12 12 0 1 1 50 75 L50 30 L85 20 L85 65 A12 12 0 1 1 95 55 L95 10 L50 20" stroke="#222" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
        <circle cx="38" cy="85" r="8" fill="#1dbf73"/>
        <circle cx="73" cy="65" r="8" fill="#1dbf73"/>
      </svg>
    ),
    "Business": (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 90, height: 90 }}>
        <rect x="20" y="30" width="55" height="50" rx="4" stroke="#222" strokeWidth="2.5" fill="none"/>
        <line x1="20" y1="43" x2="75" y2="43" stroke="#222" strokeWidth="2"/>
        <circle cx="32" cy="36" r="4" stroke="#222" strokeWidth="2" fill="none"/>
        <circle cx="50" cy="60" r="12" stroke="#1dbf73" strokeWidth="2.5" fill="none"/>
        <polyline points="44,60 49,65 58,55" stroke="#1dbf73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="90" cy="45" r="14" stroke="#222" strokeWidth="2" fill="none"/>
        <ellipse cx="90" cy="41" rx="5" ry="5" stroke="#222" strokeWidth="2" fill="none"/>
        <path d="M82 56 Q90 52 98 56" stroke="#222" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <line x1="90" y1="59" x2="90" y2="70" stroke="#222" strokeWidth="2"/>
        <line x1="84" y1="65" x2="96" y2="65" stroke="#222" strokeWidth="2"/>
      </svg>
    ),
    "Data": (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 90, height: 90 }}>
        <rect x="20" y="25" width="60" height="50" rx="4" stroke="#222" strokeWidth="2.5" fill="none"/>
        <line x1="20" y1="38" x2="80" y2="38" stroke="#222" strokeWidth="2"/>
        <path d="M35 55 L45 50 L55 60 L70 45" stroke="#1dbf73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="45" cy="50" r="3" fill="#1dbf73"/>
        <circle cx="55" cy="60" r="3" fill="#1dbf73"/>
        <circle cx="35" cy="55" r="3" fill="#1dbf73"/>
        <circle cx="70" cy="45" r="3" fill="#1dbf73"/>
        <rect x="30" y="80" width="40" height="5" rx="2.5" stroke="#222" strokeWidth="2" fill="none"/>
        <line x1="50" y1="75" x2="50" y2="80" stroke="#222" strokeWidth="2"/>
        <circle cx="95" cy="40" r="12" stroke="#222" strokeWidth="2" fill="none"/>
        <ellipse cx="95" cy="37" rx="5" ry="5" stroke="#222" strokeWidth="1.8" fill="none"/>
        <path d="M88 50 Q95 46 102 50" stroke="#222" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  };

  return illustrations[type] || null;
};

const categories = [
  { id: 1, name: "Design", query: "Design" },
  { id: 2, name: "Development", query: "Development" },
  { id: 3, name: "Marketing", query: "Marketing" },
  { id: 4, name: "Writing", query: "Writing" },
  { id: 5, name: "Video", query: "Video" },
  { id: 6, name: "Music", query: "Music" },
  { id: 7, name: "Business", query: "Business" },
  { id: 8, name: "Data", query: "Data" },
];

export default function CategoriesSection() {
  const navigate = useNavigate();

  const handleClick = (query) => {
    navigate(`/gigs?category=${encodeURIComponent(query)}`);
  };

  return (
    <section style={{ background: "#fff", padding: "80px 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <h2 style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            color: "#1a1a2e",
            marginBottom: 10,
            letterSpacing: "-0.5px",
          }}>
            Top categories
          </h2>
          <p style={{ color: "#6b7280", fontSize: "1rem" }}>
            Easily find the right service from over 2000+ skills
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.query)}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                padding: "32px 20px 24px",
                cursor: "pointer",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                transition: "all 0.25s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#1dbf73";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
            >
              <div style={{
                width: 100,
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <CategoryIllustration type={cat.name} />
              </div>
              <span style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#1a1a2e",
              }}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
