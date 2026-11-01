import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";
import { closeMenu, toggleMenu } from "../../store/slices/uiSlice";
import { logout } from "../../store/slices/authSlice";
import { selectUser } from "../../store/selectors";
import { toPath } from "../../utils/authNav";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/explore", label: "Explore" },
  { to: "/library", label: "My Library" },
];

const linkCls = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive ? "bg-green-100 text-green-900" : "text-zinc-600 hover:bg-green-100 hover:text-green-900"
  }`;

/** search (left) | links (centre) | welcome + log out (right). On phones the links collapse into a menu. */
export default function Navbar() {
  const dispatch = useDispatch();
  const menuOpen = useSelector((s) => s.ui.menuOpen);
  const user = useSelector(selectUser);
  const firstName = user?.name?.split(" ")[0];
  const loggedIn = useSelector((s) => Boolean(s.auth.token));
  const navigate = useNavigate();
  const location = useLocation();

  // guests get the login / signup box on top of the page they are on
  const openAuth = (path) => {
    const here = toPath(location);
    navigate(path, { state: { backgroundLocation: here, from: here } });
  };

  // members-only page: leave it when logging out
  const onLogout = () => {
    if (location.pathname === "/library") navigate("/");
    dispatch(logout());
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 md:grid md:grid-cols-[1fr_auto_1fr] lg:px-10">
        {/* left: search (+ menu button on phones) */}
        <div className="flex min-w-0 flex-1 items-center gap-2 md:justify-start">
          <button
            onClick={() => dispatch(toggleMenu())}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-green-200 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <SearchBar />
        </div>

        {/* centre: links */}
        <nav className="hidden items-center gap-1 md:flex uppercase text-sm font-medium">
          {LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkCls}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* right: welcome + log out */}
        <div className="flex shrink-0 items-center justify-end gap-1.5">
          {loggedIn ? (
            <>
              {firstName && (
                <span className="hidden truncate text-sm text-zinc-600 sm:block">
                  Welcome, <b className="font-semibold text-zinc-900">{firstName}</b>
                </span>
              )}
              <button
                onClick={onLogout}
                aria-label="Log out"
                title="Log out"
                className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition hover:bg-green-200 hover:text-green-900"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openAuth("/login")}
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-green-200 hover:text-green-900"
              >
                Log in
              </button>
              <button
                onClick={() => openAuth("/signup")}
                className="hidden rounded-full bg-green-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-200 hover:text-green-900 sm:block"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <nav className="mx-4 mb-3 flex animate-fade-in flex-col gap-1 rounded-2xl bg-white p-3 shadow-lg md:hidden">
          {LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => dispatch(closeMenu())} className={linkCls}>
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}