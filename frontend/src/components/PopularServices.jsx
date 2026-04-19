import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllGigs } from "../api/gigs";
import GigCard from "./GigCard";

const tabs = ["Featured", "Newest", "Top rate"];

export default function PopularServices() {
  const [activeTab, setActiveTab] = useState("Featured");
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      try {
        const data = await getAllGigs();
        let sorted = [...data];
        if (activeTab === "Newest") {
          sorted = sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (activeTab === "Top rate") {
          sorted = sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        setGigs(sorted.slice(0, 3));
      } catch (err) {
        setError("Failed to load services.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, [activeTab]);

  return (
    <section style={{ background: "#fff", padding: "70px 2rem", borderTop: "1px solid #f0f0f0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            color: "#1a1a2e",
            marginBottom: 10,
            letterSpacing: "-0.5px",
          }}>
            Popular service
          </h2>
          <p style={{ color: "#6b7280", fontSize: "1rem" }}>
            Service is highly appreciated by users
          </p>
        </div>

        {/* Tab Bar */}
        <div style={{
          display: "flex",
          gap: 28,
          marginBottom: 36,
          borderBottom: "1px solid #e5e7eb",
          justifyContent: "center",
        }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 4px",
                border: "none",
                background: "transparent",
                fontSize: "0.95rem",
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? "#1dbf73" : "#6b7280",
                borderBottom: activeTab === tab ? "2px solid #1dbf73" : "2px solid transparent",
                marginBottom: -1,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Gig Cards */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                height: 300,
                borderRadius: 16,
                background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", color: "#ef4444", padding: "40px 0" }}>{error}</div>
        ) : gigs.length === 0 ? (
          <div style={{ textAlign: "center", color: "#6b7280", padding: "40px 0" }}>
            No services available yet.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {gigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        )}

        {/* View All */}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link
            to="/gigs"
            style={{
              display: "inline-block",
              padding: "12px 32px",
              border: "2px solid #1dbf73",
              borderRadius: 50,
              color: "#1dbf73",
              fontWeight: 600,
              fontSize: "0.95rem",
              transition: "all 0.2s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1dbf73"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1dbf73"; }}
          >
            View all services →
          </Link>
        </div>
      </div>
    </section>
  );
}
