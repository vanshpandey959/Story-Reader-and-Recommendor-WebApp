import { useDispatch, useSelector } from "react-redux";
import { CloudOff } from "lucide-react";
import HeroClock from "../components/home/HeroBanner";
import BookLane from "../components/books/BookLane";
import EmptyState from "../components/common/EmptyState";
import { loadBooks } from "../store/slices/booksSlice";
import {
  selectBooksStatus,
  selectMoreStories,
  selectPopular,
  selectReadingBooks,
  selectRecommended,
} from "../store/selectors";

export default function HomePage() {
  const dispatch = useDispatch();
  const status = useSelector(selectBooksStatus);
  const popular = useSelector(selectPopular);
  const reading = useSelector(selectReadingBooks);
  const recommended = useSelector(selectRecommended);
  const more = useSelector(selectMoreStories);
  const loggedIn = useSelector((s) => Boolean(s.auth.token));

  const loading = status === "idle" || status === "loading";

  return (
    <div className="space-y-8">
      <HeroClock />

      {status === "failed" ? (
        <EmptyState icon={CloudOff} title="Couldn't load stories" text="Check your connection and try again.">
          <button
            onClick={() => dispatch(loadBooks())}
            className="rounded-full bg-green-900 px-5 py-2 text-sm font-medium text-white hover:bg-green-200 hover:text-green-900"
          >
            Retry
          </button>
        </EmptyState>
      ) : (
        <>
          <BookLane title="Popular" books={popular} loading={loading} viewAllTo="/explore" />
          {loggedIn && (
            <BookLane
              title="Continue Reading"
              books={reading}
              loading={loading}
              viewAllTo="/library?tab=reading"
              emptyText="Nothing in progress. Open any story and hit “Start reading” - it will wait for you here."
            />
          )}
          <BookLane title="Recommended for you" books={recommended} loading={loading} viewAllTo="/explore" />
          <BookLane title="More Stories" books={more} loading={loading} viewAllTo="/explore" />
        </>
      )}
    </div>
  );
}