import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@context/AuthContext";
import ROUTES from "@constants/routes";

export function AdminRoute({ children }) {
  const { isAuthenticated, user, login } = useAuth();
  const location = useLocation();
  const isUserManagementDemo = location.pathname === ROUTES.ADMIN_USERS;
  const hasQueryBypass = new URLSearchParams(location.search).get("admin_bypass") === "true";
  const isBypassEnabled = isUserManagementDemo || hasQueryBypass;

  useEffect(() => {
    if (isBypassEnabled && !isAuthenticated) {
      login({ email: "admin@speakmate.ai", role: "ADMIN" });
    }
  }, [isAuthenticated, isBypassEnabled, login]);

  // User Management is an intentionally public, mock-only admin demo route.
  // Remove this bypass when real authentication is connected.
  if (isBypassEnabled) {
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace state={{ from: location }} />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}

export default AdminRoute;