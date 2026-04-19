import { useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const roles = [
  { id: "buyer", label: "Buyer" },
  { id: "seller", label: "Freelancer" },
];

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  color: "#1f2937",
  fontSize: "0.95rem",
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

export default function AuthModal() {
  const { authModalType, openAuthModal, closeAuthModal, login } = useAuth();
  
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Clear states when toggling tabs
  useEffect(() => {
    setError("");
    setSuccess("");
    setShowPassword(false);
    setForm({ name: "", email: "", password: "", role: "buyer" });
  }, [authModalType]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeAuthModal();
    };
    if (authModalType) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [authModalType, closeAuthModal]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await loginUser(form.email, form.password);
      login(token, user);
      closeAuthModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
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
      setSuccess("Account created! Logging in...");
      // Auto login after successful registration to match a seamless modal experience
      const { token, user } = await loginUser(form.email, form.password);
      login(token, user);
      setTimeout(() => closeAuthModal(), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!authModalType) return null;

  const isLogin = authModalType === "login";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(4px)",
      }}
      onClick={closeAuthModal}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "460px",
          borderRadius: "16px",
          padding: "36px 40px",
          position: "relative",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: "absolute",
            top: "20px",
            right: "24px",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#6b7280",
            padding: 0,
            lineHeight: 1,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#1f2937"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"}
        >
          &times;
        </button>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid #e5e7eb", marginBottom: "24px" }}>
          <button
            onClick={() => openAuthModal("login")}
            style={{
              background: "none",
              border: "none",
              padding: "0 0 12px 0",
              borderBottom: `2px solid ${isLogin ? "#1f2937" : "transparent"}`,
              color: isLogin ? "#1f2937" : "#9ca3af",
              fontWeight: isLogin ? "700" : "600",
              fontSize: "1.2rem",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
          >
            Log in
          </button>
          <button
            onClick={() => openAuthModal("register")}
            style={{
              background: "none",
              border: "none",
              padding: "0 0 12px 0",
              borderBottom: `2px solid ${!isLogin ? "#1f2937" : "transparent"}`,
              color: !isLogin ? "#1f2937" : "#9ca3af",
              fontWeight: !isLogin ? "700" : "600",
              fontSize: "1.2rem",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error / Success Banners */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "8px", padding: "12px 16px", color: "#ef4444", fontSize: "0.875rem", marginBottom: "20px",
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{
            background: "#f0fdf4", border: "1px solid #dcfce7",
            borderRadius: "8px", padding: "12px 16px", color: "#059669", fontSize: "0.875rem", marginBottom: "20px",
          }}>
            {success}
          </div>
        )}

        {isLogin ? (
          <>
            {/* Login Hint Box */}
            <div style={{
              background: "#f0fdf4",
              border: "1px solid #dcfce7",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
              fontSize: "0.85rem",
              color: "#374151",
              lineHeight: "1.6"
            }}>
              Username: <span style={{ color: "#059669", fontWeight: "600" }}>Buyer</span> or <span style={{ color: "#059669", fontWeight: "600" }}>Freelancer</span><br />
              Password: <span style={{ color: "#059669", fontWeight: "600" }}>demo1234</span>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Email */}
              <div>
                <label style={{ display: "block", color: "#111827", fontSize: "0.95rem", fontWeight: "600", marginBottom: "8px" }}>
                  Account or Email
                </label>
                <input
                  id="modal-login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter Account or Email"
                  required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#059669"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: "block", color: "#111827", fontSize: "0.95rem", fontWeight: "600", marginBottom: "8px" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="modal-login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    required
                    style={{ ...inputStyle, padding: "12px 48px 12px 16px" }}
                    onFocus={e => e.target.style.borderColor = "#059669"}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute", right: "14px", top: "50%",
                      transform: "translateY(-50%)", background: "none",
                      border: "none", color: "#6b7280", cursor: "pointer",
                      fontSize: "1rem", padding: "2px",
                    }}
                  >
                    {showPassword ? "🔒" : "👁"}
                  </button>
                </div>
                
                <div style={{ marginTop: "16px", fontSize: "0.85rem", color: "#4b5563" }}>
                  Forgot your password? <button type="button" style={{ background: "none", border: "none", padding: 0, color: "#059669", fontWeight: "500", cursor: "pointer" }}>Reset password.</button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="modal-login-submit"
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: loading ? "#10b981" : "#059669",
                  color: "#fff",
                  borderRadius: "30px", // Pill shape
                  fontWeight: "600",
                  fontSize: "1rem",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 0.2s, transform 0.1s",
                  opacity: loading ? 0.8 : 1,
                  marginTop: "8px",
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#047857"; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#059669"; }}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Role selector */}
            <div>
               <label style={{ display: "block", color: "#111827", fontSize: "0.95rem", fontWeight: "600", marginBottom: "8px" }}>
                I want to register as
              </label>
              <div style={{ display: "flex", gap: "12px" }}>
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setForm({ ...form, role: role.id })}
                    style={{
                      flex: 1,
                      padding: "10px",
                      border: `1px solid ${form.role === role.id ? "#059669" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      background: form.role === role.id ? "#f0fdf4" : "#fff",
                      color: form.role === role.id ? "#059669" : "#4b5563",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label style={{ display: "block", color: "#111827", fontSize: "0.95rem", fontWeight: "600", marginBottom: "8px" }}>
                Full Name
              </label>
              <input
                id="modal-register-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Full Name"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#059669"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", color: "#111827", fontSize: "0.95rem", fontWeight: "600", marginBottom: "8px" }}>
                Email Address
              </label>
              <input
                id="modal-register-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#059669"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", color: "#111827", fontSize: "0.95rem", fontWeight: "600", marginBottom: "8px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="modal-register-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  style={{ ...inputStyle, padding: "12px 48px 12px 16px" }}
                  onFocus={e => e.target.style.borderColor = "#059669"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "14px", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", color: "#6b7280", cursor: "pointer",
                    fontSize: "1rem", padding: "2px",
                  }}
                >
                  {showPassword ? "🔒" : "👁"}
                </button>
              </div>
              
              <div style={{ marginTop: "16px", fontSize: "0.85rem", color: "#4b5563" }}>
                By signing up, you agree to our <a href="#" style={{ color: "#059669", fontWeight: "500", textDecoration: "none" }}>Terms of Service</a> & <a href="#" style={{ color: "#059669", fontWeight: "500", textDecoration: "none" }}>Privacy Policy</a>.
              </div>
            </div>

            {/* Submit */}
            <button
              id="modal-register-submit"
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "#10b981" : "#059669",
                color: "#fff",
                borderRadius: "30px", // Pill shape
                fontWeight: "600",
                fontSize: "1rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s, transform 0.1s",
                opacity: loading ? 0.8 : 1,
                marginTop: "8px",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#047857"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#059669"; }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
