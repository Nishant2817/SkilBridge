import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal("login");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, openAuthModal, navigate]);

  if (!isAuthenticated) return null; // Avoid flashing content before redirect

  return children;
}
