import { useCallback, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import BookSpread from "../components/auth/BookSpread";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import { clearAuthError } from "../store/slices/authSlice";
import { clearPendingAction } from "../store/slices/uiSlice";
import { toPath } from "../utils/authNav";

/** Login / signup box. It floats over the page the visitor was on, which stays visible but blurred and frozen. */
export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((s) => s.auth.token);

  const mode = location.pathname === "/signup" ? "signup" : "login";
  const { backgroundLocation, from } = location.state ?? {};

  useEffect(() => {
    dispatch(clearAuthError());
  }, [mode, dispatch]);

  // freeze the page behind the box
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // closing = back to the page underneath, and forget what they were about to do
  const close = useCallback(() => {
    dispatch(clearPendingAction());
    navigate(toPath(backgroundLocation), { replace: true });
  }, [dispatch, navigate, backgroundLocation]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // logged in / signed up -> straight back to what they were doing
  if (token) return <Navigate to={toPath(from ?? backgroundLocation)} replace />;

  // keep `state` so the "where you came from" redirect survives the toggle
  const toggle = () => navigate(mode === "login" ? "/signup" : "/login", { state: location.state, replace: true });

  return (
    <div role="dialog" aria-modal="true" aria-label={mode === "login" ? "Log in" : "Sign up"} className="fixed inset-0 z-50 overflow-y-auto bg-white/40 backdrop-blur-md">
      <button
        onClick={close}
        aria-label="Close"
        className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-700 shadow-md transition hover:bg-green-200"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className="flex min-h-full flex-col items-center justify-center gap-6 p-4"
        onMouseDown={(e) => e.target === e.currentTarget && close()}
      >
        <BookSpread mode={mode} onToggle={toggle} />

        {/* small screens: a single page instead of the open book */}
        <div className="w-full max-w-md animate-fade-in rounded-2xl bg-white p-6 shadow-xl md:hidden">
          {mode === "login" ? <LoginForm /> : <SignupForm />}
          <button onClick={toggle} className="mt-5 w-full text-center text-sm font-medium text-green-900 rounded-lg py-2 transition hover:bg-green-200">
            {mode === "login" ? "New here? Create an account" : "Already a reader? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}