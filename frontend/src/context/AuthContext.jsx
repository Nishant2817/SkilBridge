import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "fh_token";
const USER_KEY  = "fh_user";
const MODE_KEY  = "fh_mode";  // "buyer" | "seller"

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Mode defaults to "buyer". If user is a seller and stored mode is "seller", restore it.
  const [mode, setModeState] = useState(() => {
    const stored = localStorage.getItem(MODE_KEY);
    return stored === "seller" ? "seller" : "buyer";
  });

  // ─── login ───────────────────────────────────────────────────────────────
  const login = useCallback((newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    // New logins always start in buyer mode
    localStorage.setItem(MODE_KEY, "buyer");
    setToken(newToken);
    setUser(newUser);
    setModeState("buyer");
  }, []);

  // ─── logout ──────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(MODE_KEY);
    setToken(null);
    setUser(null);
    setModeState("buyer");
  }, []);

  // ─── setMode ─────────────────────────────────────────────────────────────
  // Switches buyer ↔ seller. Guards: must be authenticated + must be a seller
  // to enter seller mode.
  const setMode = useCallback((newMode) => {
    if (newMode === "seller") {
      // Guard: user must have isSeller === true
      const currentUser = JSON.parse(localStorage.getItem(USER_KEY) || "null");
      if (!currentUser?.isSeller) return; // silently ignore
    }
    localStorage.setItem(MODE_KEY, newMode);
    setModeState(newMode);
  }, []);

  // ─── activateSeller ──────────────────────────────────────────────────────
  // Called after a successful PUT /api/users/become-seller.
  // Updates the stored user object in-place (no re-login required).
  const activateSeller = useCallback((updatedUser) => {
    const merged = { ...updatedUser };
    localStorage.setItem(USER_KEY, JSON.stringify(merged));
    setUser(merged);
    // Automatically switch to seller mode
    localStorage.setItem(MODE_KEY, "seller");
    setModeState("seller");
  }, []);

  // ─── updateUser ──────────────────────────────────────────────────────────
  // Called after a successful PUT /api/users/profile to patch local state.
  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem(USER_KEY, JSON.stringify(merged));
      return merged;
    });
  }, []);

  const isSeller = user?.isSeller === true;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        mode,
        setMode,
        login,
        logout,
        activateSeller,
        updateUser,
        isAuthenticated: !!token,
        isSeller,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
