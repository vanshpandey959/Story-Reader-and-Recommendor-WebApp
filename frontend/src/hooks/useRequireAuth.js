import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setPendingAction } from "../store/slices/uiSlice";
import { toPath } from "../utils/authNav";

/**
 * Gate for personal actions (save, start reading ...).
 *   const requireAuth = useRequireAuth();
 *   if (!requireAuth({ type: "save", bookId })) return;   // login opens on top of this page
 * Returns true when the visitor is already logged in. Otherwise it opens the login box over the
 * current page and remembers the action, which runs as soon as they have logged in or signed up.
 */
export default function useRequireAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((s) => s.auth.token);

  return useCallback(
    (action) => {
      if (token) return true;
      if (action) dispatch(setPendingAction(action));
      const here = toPath(location);
      navigate("/login", { state: { backgroundLocation: here, from: here } });
      return false;
    },
    [token, location, dispatch, navigate]
  );
}