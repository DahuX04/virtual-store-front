import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthStorage from "../auth/authStorage";

export default function RequireRole({ role }) {
  const location = useLocation();

  const token = AuthStorage.getToken();
  const currentRole = AuthStorage.getRole();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && currentRole !== role) {
    // si quieres, manda a una pantalla "No autorizado"
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}