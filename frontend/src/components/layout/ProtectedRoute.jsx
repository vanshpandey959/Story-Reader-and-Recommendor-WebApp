import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getLastPage, toPath } from "../../utils/authNav";

/** Members-only pages. A visitor who isn't logged in gets the login box on top of the page
 *  they came from, and lands here once they are in. */
export default function ProtectedRoute() {
  const token = useSelector((s) => s.auth.token);
  const location = useLocation();
  if (token) return <Outlet />;
  return <Navigate to="/login" replace state={{ from: toPath(location), backgroundLocation: getLastPage() }} />;
}