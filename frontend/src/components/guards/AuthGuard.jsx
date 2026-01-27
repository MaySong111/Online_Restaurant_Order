import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import { ROUTES } from "../../constants/routes";
import Cookies from "js-cookie";

export default function AuthGuard({ requiredRole }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const user = useAuthStore((state) => state.user);
  // console.log("AuthGuard user info:", user);
  const token = Cookies.get("restaurant-token");

  // not logged in
  if (!isAuthenticated || !token) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  // role not authorized
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={ROUTES.UNAUTHORIZED} />;
  }

  return <Outlet />;
}
