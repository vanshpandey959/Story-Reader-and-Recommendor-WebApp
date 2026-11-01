import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PageLoader from "./components/common/PageLoader";

// route-level code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const ExplorePage = lazy(() => import("./pages/ExplorePage"));
const BookPage = lazy(() => import("./pages/BookPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const HOME = { pathname: "/", search: "", hash: "", state: null, key: "auth-background" };

export default function App() {
  const location = useLocation();

  // /login and /signup open on top of the page the visitor was on (or Home if they came in directly)
  const isAuthPath = location.pathname === "/login" || location.pathname === "/signup";
  const background = isAuthPath ? { ...HOME, ...location.state?.backgroundLocation } : location;

  return (
    <>
      <Suspense fallback={<PageLoader fullScreen />}>
        <Routes location={background}>
          <Route element={<AppLayout />}>
            {/* open to everyone */}
            <Route index element={<HomePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="book/:id" element={<BookPage />} />

            {/* needs an account */}
            <Route element={<ProtectedRoute />}>
              <Route path="library" element={<LibraryPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {isAuthPath && (
        <Suspense fallback={null}>
          <AuthPage />
        </Suspense>
      )}
    </>
  );
}