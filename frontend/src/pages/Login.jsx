import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await loginUser(form.email, form.password);
      login(token, user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "400px",
          background: "radial-gradient(circle, rgba(29,191,115,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "440px", position: "relative" }}>
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
          {/* Logo and title */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #1dbf73, #0a9d5a)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "900",
                color: "#fff",
                margin: "0 auto 16px",
              }}
            >
              S
            </div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#e8e8f0", letterSpacing: "-0.5px", marginBottom: "8px" }}>
              Welcome back
            </h1>
            <p style={{ color: "#6b6b8a", fontSize: "0.9rem" }}>
              Sign in to your SkillBridge account
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "#f87171",
                fontSize: "0.875rem",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", color: "#a0a0c0", fontSize: "0.85rem", fontWeight: "500", marginBottom: "8px" }}>
                Email Address
              </label>
              <input
                id="login-email"
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
              <label style={{ display: "block", color: "#a0a0c0", fontSize: "0.85rem", fontWeight: "500", marginBottom: "8px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
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
                    border: "none", color: "#6b6b8a", cursor: "pointer",
                    fontSize: "1rem", padding: "2px",
                  }}
                >
                  {showPassword ? "🔒" : "👁"}
                </button>
              </div>
              <div style={{ textAlign: "right", marginTop: "6px" }}>
                <a href="#" style={{ color: "#1dbf73", fontSize: "0.8rem", fontWeight: "500" }}>Forgot password?</a>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "#0a9d5a" : "linear-gradient(135deg, #1dbf73, #0a9d5a)",
                color: "#fff",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "1rem",
                boxShadow: "0 6px 25px rgba(29,191,115,0.4)",
                transition: "transform 0.2s, box-shadow 0.2s",
                marginTop: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                border: "none",
                opacity: loading ? 0.8 : 1,
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 10px 35px rgba(29,191,115,0.55)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 25px rgba(29,191,115,0.4)"; }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#6b6b8a", fontSize: "0.875rem", marginTop: "28px" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#1dbf73", fontWeight: "600" }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
