import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector, useStore } from "react-redux";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import BookSpines from "./BookSpines";
import PageLoader from "../common/PageLoader";
import { loadBooks } from "../../store/slices/booksSlice";
import { completeBook, loadLibrary, startReading, toggleSaved } from "../../store/slices/librarySlice";
import { clearPendingAction } from "../../store/slices/uiSlice";
import { setLastPage } from "../../utils/authNav";

const PENDING = { start: startReading, complete: completeBook, save: toggleSaved };

export default function AppLayout() {
  const dispatch = useDispatch();
  const store = useStore();
  const location = useLocation();
  const { pathname } = location;
  const token = useSelector((s) => s.auth.token);

  // stories are public: load once for the whole app
  useEffect(() => {
    dispatch(loadBooks());
  }, [dispatch]);

  // the personal library only exists for logged-in readers. Right after login / signup,
  // finish whatever they were trying to do (save, start reading ...) once it has loaded.
  useEffect(() => {
    if (!token) return;
    let active = true;
    (async () => {
      await dispatch(loadLibrary());
      const pending = store.getState().ui.pendingAction;
      if (!active || !pending) return;
      dispatch(clearPendingAction());
      dispatch(PENDING[pending.type](pending.bookId));
    })();
    return () => {
      active = false;
    };
  }, [token, dispatch, store]);

  // remember the page, so a login box can open on top of it later
  useEffect(() => {
    if (pathname !== "/library") setLastPage(location);
  }, [location, pathname]);

  return (
    <div className="min-h-screen">
      <ScrollToTop />

      <BookSpines />
      <Navbar />

      <div className="flex min-h-screen flex-col pb-4 pt-16">
        {/* content is centred and never touches the edges (same width + padding as the navbar) */}
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-10">
          <main key={pathname} className="flex-1 animate-fade-in py-6">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}