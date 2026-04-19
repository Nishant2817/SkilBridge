import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

const roles = [
  { id: "buyer", label: "Buyer", desc: "I want to hire freelancers", emoji: "🛒" },
  { id: "seller", label: "Freelancer", desc: "I want to offer services", emoji: "💼" },
];

const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid #2a2a3a",
  borderRadius: "12px",
  color: "#e8e8f0",
  fontSize: "0.95rem",
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await registerUser(
        form.name,
        form.email,
        form.password,
        form.role === "seller"
      );
      setSuccess("Account created! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 1.5rem 60px",
        background: "linear-gradient(135deg, #0a0a0f 0%, #0f0f1e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "20%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "480px", position: "relative" }}>
        <div
          style={{
            background: "rgba(19,19,26,0.9)",
            border: "1px solid #1e1e2e",
            borderRadius: "24px",
            padding: "48px 40px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                width: "48px", height: "48px",
                background: "linear-gradient(135deg, #1dbf73, #0a9d5a)",
                borderRadius: "14px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "22px", fontWeight: "900", color: "#fff",
                margin: "0 auto 16px",
              }}
            >
              S
            </div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#e8e8f0", letterSpacing: "-0.5px", marginBottom: "8px" }}>
              Create your account
            </h1>
            <p style={{ color: "#6b6b8a", fontSize: "0.9rem" }}>Join thousands of freelancers and businesses</p>
          </div>

          {/* Error / Success banners */}
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "10px", padding: "12px 16px",
              color: "#f87171", fontSize: "0.875rem", marginBottom: "20px",
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              background: "rgba(29,191,115,0.1)", border: "1px solid rgba(29,191,115,0.3)",
              borderRadius: "10px", padding: "12px 16px",
              color: "#1dbf73", fontSize: "0.875rem", marginBottom: "20px",
            }}>
              {success}
            </div>
          )}

          {/* Role selector */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setForm({ ...form, role: role.id })}
                style={{
                  padding: "14px 12px",
                  border: `2px solid ${form.role === role.id ? "#1dbf73" : "#2a2a3a"}`,
                  borderRadius: "12px",
                  background: form.role === role.id ? "rgba(29,191,115,0.08)" : "rgba(255,255,255,0.03)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.4rem", marginBottom: "4px" }}>{role.emoji}</div>
                <div style={{ fontWeight: "700", color: form.role === role.id ? "#1dbf73" : "#c0c0d8", fontSize: "0.9rem" }}>{role.label}</div>
                <div style={{ color: "#6b6b8a", fontSize: "0.75rem", marginTop: "2px" }}>{role.desc}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Name */}
            <div>
              <label style={{ display: "block", color: "#a0a0c0", fontSize: "0.85rem", fontWeight: "500", marginBottom: "8px" }}>Full Name</label>
              <input
                id="register-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1dbf73"}
                onBlur={e => e.target.style.borderColor = "#2a2a3a"}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", color: "#a0a0c0", fontSize: "0.85rem", fontWeight: "500", marginBottom: "8px" }}>Email Address</label>
              <input
                id="register-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1dbf73"}
                onBlur={e => e.target.style.borderColor = "#2a2a3a"}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", color: "#a0a0c0", fontSize: "0.85rem", fontWeight: "500", marginBottom: "8px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  style={{ ...inputStyle, padding: "13px 48px 13px 16px" }}
                  onFocus={e => e.target.style.borderColor = "#1dbf73"}
                  onBlur={e => e.target.style.borderColor = "#2a2a3a"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "14px", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", color: "#6b6b8a", cursor: "pointer", fontSize: "1rem",
                  }}
                >
                  {showPassword ? "🔒" : "👁"}
                </button>
              </div>
              {/* Password strength */}
              {form.password.length > 0 && (
                <div style={{ marginTop: "8px", display: "flex", gap: "4px" }}>
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1, height: "3px", borderRadius: "2px",
                        background: i < Math.floor(form.password.length / 3)
                          ? form.password.length < 6 ? "#ef4444" : form.password.length < 10 ? "#f59e0b" : "#1dbf73"
                          : "#2a2a3a",
                        transition: "background 0.3s",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: loading ? "#0a9d5a" : "linear-gradient(135deg, #1dbf73, #0a9d5a)",
                color: "#fff", borderRadius: "12px", fontWeight: "700",
                fontSize: "1rem", boxShadow: "0 6px 25px rgba(29,191,115,0.4)",
                transition: "transform 0.2s, box-shadow 0.2s", marginTop: "4px",
                cursor: loading ? "not-allowed" : "pointer", border: "none",
                opacity: loading ? 0.8 : 1,
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 10px 35px rgba(29,191,115,0.55)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 25px rgba(29,191,115,0.4)"; }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <p style={{ textAlign: "center", color: "#4a4a6a", fontSize: "0.8rem" }}>
              By signing up, you agree to our{" "}
              <a href="#" style={{ color: "#1dbf73" }}>Terms of Service</a>{" "}
              and{" "}
              <a href="#" style={{ color: "#1dbf73" }}>Privacy Policy</a>
            </p>
          </form>

          <p style={{ textAlign: "center", color: "#6b6b8a", fontSize: "0.875rem", marginTop: "24px" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1dbf73", fontWeight: "600" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
