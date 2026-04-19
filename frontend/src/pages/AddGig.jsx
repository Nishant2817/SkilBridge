import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createGig } from "../api/gigs";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "Design",
  "Development",
  "Marketing",
  "Writing",
  "Video",
  "Music",
  "Business",
  "Data",
];

const CAT_ICONS = {
  Design: "🎨", Development: "💻", Marketing: "📣",
  Writing: "✍️", Video: "🎬", Music: "🎵",
  Business: "💼", Data: "🤖",
};

export default function AddGig() {
  const navigate = useNavigate();
  const { token, isSeller } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: CATEGORIES[0],
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState("");   // base64 data URL for preview
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Guard: non-sellers see access denied
  if (!isSeller) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f", flexDirection: "column", gap: "12px" }}>
        <div style={{ fontSize: "3rem" }}>🔒</div>
        <h2 style={{ color: "#f87171", fontWeight: "800", fontSize: "1.5rem" }}>Sellers Only</h2>
        <p style={{ color: "#6b6b8a", textAlign: "center", maxWidth: "320px" }}>
          You need a seller account to post gigs. Activate it from the navbar menu.
        </p>
        <button
          onClick={() => navigate("/")}
          style={{ marginTop: "8px", padding: "10px 24px", background: "rgba(29,191,115,0.1)", border: "1px solid rgba(29,191,115,0.3)", color: "#1dbf73", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Read a File object → base64 data URL and store in formData.image
  const readFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, GIF, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPreview(dataUrl);
      setFormData((prev) => ({ ...prev, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => readFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    readFile(e.dataTransfer.files[0]);
  };

  const removeImage = () => {
    setPreview("");
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createGig(
        { ...formData, price: Number(formData.price) },
        token
      );
      setSuccess(true);
      setTimeout(() => navigate("/gigs"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Shared input style
  const input = {
    width: "100%", padding: "13px 16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid #1e1e2e",
    color: "#e8e8f0", borderRadius: "10px",
    fontSize: "0.95rem", outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh",
      padding: "100px 1.5rem 80px",
      background: "linear-gradient(135deg, #0a0a0f 0%, #0f0f1e 100%)",
    }}>
      <div style={{
        maxWidth: "640px", margin: "0 auto",
        background: "rgba(13,13,20,0.85)",
        border: "1px solid #1e1e2e",
        borderRadius: "24px",
        padding: "48px 40px",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        backdropFilter: "blur(20px)",
      }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #1dbf73, #0a9d5a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px",
            }}>🚀</div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#e8e8f0", margin: 0 }}>
              Create a Gig
            </h1>
          </div>
          <p style={{ color: "#6b6b8a", fontSize: "0.9rem", margin: 0 }}>
            Fill in the details below and publish your service to the marketplace.
          </p>
        </div>

        {/* Success banner */}
        {success && (
          <div style={{
            background: "rgba(29,191,115,0.1)", border: "1px solid rgba(29,191,115,0.3)",
            color: "#1dbf73", padding: "14px 16px", borderRadius: "10px",
            marginBottom: "24px", fontWeight: "600", fontSize: "0.9rem",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            ✅ Gig published! Redirecting to marketplace…
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div style={{
            background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
            color: "#f87171", padding: "14px 16px", borderRadius: "10px",
            marginBottom: "24px", fontSize: "0.9rem",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Title */}
          <div>
            <label style={{ display: "block", color: "#9090b0", marginBottom: "8px", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "0.03em" }}>
              GIG TITLE *
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="I will design a professional logo for your brand…"
              style={input}
              onFocus={e => e.target.style.borderColor = "#1dbf73"}
              onBlur={e => e.target.style.borderColor = "#1e1e2e"}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", color: "#9090b0", marginBottom: "8px", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "0.03em" }}>
              DESCRIPTION *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe what you offer, your process, and what the buyer will receive…"
              style={{ ...input, minHeight: "130px", resize: "vertical", lineHeight: "1.6" }}
              onFocus={e => e.target.style.borderColor = "#1dbf73"}
              onBlur={e => e.target.style.borderColor = "#1e1e2e"}
            />
          </div>

          {/* Price + Category */}
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", color: "#9090b0", marginBottom: "8px", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "0.03em" }}>
                PRICE (USD) *
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#6b6b8a", fontSize: "1rem", fontWeight: "700", pointerEvents: "none" }}>$</span>
                <input
                  name="price"
                  type="number"
                  min="5"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="50"
                  style={{ ...input, paddingLeft: "30px" }}
                  onFocus={e => e.target.style.borderColor = "#1dbf73"}
                  onBlur={e => e.target.style.borderColor = "#1e1e2e"}
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", color: "#9090b0", marginBottom: "8px", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "0.03em" }}>
                CATEGORY *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ ...input, cursor: "pointer" }}
                onFocus={e => e.target.style.borderColor = "#1dbf73"}
                onBlur={e => e.target.style.borderColor = "#1e1e2e"}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} style={{ background: "#0d0d14" }}>
                    {CAT_ICONS[cat]} {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label style={{ display: "block", color: "#9090b0", marginBottom: "8px", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "0.03em" }}>
              GIG IMAGE <span style={{ color: "#4a4a6a", fontWeight: "400" }}>(optional · max 5 MB)</span>
            </label>

            {/* Hidden real file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="gig-image-upload"
            />

            {preview ? (
              /* ── Preview card ── */
              <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid #1e1e2e", height: "180px" }}>
                <img
                  src={preview}
                  alt="Gig preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {/* Overlay actions */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "rgba(0,0,0,0.45)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: "12px",
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: "8px 18px", borderRadius: "8px",
                      background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.25)", color: "#fff",
                      fontWeight: "600", fontSize: "0.85rem", cursor: "pointer",
                    }}
                  >
                    🔄 Change
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      padding: "8px 18px", borderRadius: "8px",
                      background: "rgba(239,68,68,0.2)", backdropFilter: "blur(8px)",
                      border: "1px solid rgba(239,68,68,0.4)", color: "#f87171",
                      fontWeight: "600", fontSize: "0.85rem", cursor: "pointer",
                    }}
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            ) : (
              /* ── Drop zone ── */
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragOver ? "#1dbf73" : "#2a2a3a"}`,
                  borderRadius: "12px",
                  padding: "40px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: dragOver ? "rgba(29,191,115,0.05)" : "rgba(255,255,255,0.02)",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🖼️</div>
                <p style={{ color: dragOver ? "#1dbf73" : "#9090b0", fontWeight: "600", margin: "0 0 4px", fontSize: "0.95rem" }}>
                  {dragOver ? "Drop it here!" : "Click to upload or drag & drop"}
                </p>
                <p style={{ color: "#4a4a6a", fontSize: "0.8rem", margin: 0 }}>
                  JPG, PNG, GIF, WebP · up to 5 MB
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #1e1e2e", marginTop: "4px" }} />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || success}
            style={{
              width: "100%", padding: "16px",
              background: loading || success
                ? "rgba(29,191,115,0.4)"
                : "linear-gradient(135deg, #1dbf73, #0a9d5a)",
              color: "#fff", borderRadius: "12px",
              fontWeight: "700", fontSize: "1rem",
              border: "none",
              cursor: loading || success ? "not-allowed" : "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 8px 24px rgba(29,191,115,0.3)",
            }}
            onMouseEnter={e => { if (!loading && !success) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loading ? "Publishing…" : success ? "✅ Published!" : "🚀 Publish Gig"}
          </button>

          <p style={{ textAlign: "center", color: "#4a4a6a", fontSize: "0.8rem", marginTop: "-8px" }}>
            Your gig will be live instantly on the marketplace.
          </p>
        </form>
      </div>
    </div>
  );
}
