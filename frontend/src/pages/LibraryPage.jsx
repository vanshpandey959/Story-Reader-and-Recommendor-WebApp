import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bookmark, BookOpen, CheckCircle2 } from "lucide-react";
import BookGrid from "../components/books/BookGrid";
import Pagination from "../components/common/Pagination";
import EmptyState from "../components/common/EmptyState";
import LibraryTabs, { LIBRARY_TABS } from "../components/library/LibraryTabs";
import {
  selectBooksStatus,
  selectCompletedBooks,
  selectLibrary,
  selectReadingBooks,
  selectSavedBooks,
} from "../store/selectors";
import { paginate } from "../utils/pagination";
import { PAGE_SIZE } from "../utils/constants";

const EMPTY = {
  reading: { icon: BookOpen, title: "Nothing in progress", text: "Open a story and press “Start reading” - it will wait here until you mark it completed." },
  completed: { icon: CheckCircle2, title: "No finished stories yet", text: "Mark a story as completed on its page to see it here." },
  saved: { icon: Bookmark, title: "No saved stories", text: "Tap the heart on any book to save it for later." },
};

export default function LibraryPage() {
  const [params, setParams] = useSearchParams();
  const tab = LIBRARY_TABS.some((t) => t.key === params.get("tab")) ? params.get("tab") : "reading";

  const lists = {
    reading: useSelector(selectReadingBooks),
    completed: useSelector(selectCompletedBooks),
    saved: useSelector(selectSavedBooks),
  };
  const counts = Object.fromEntries(Object.entries(lists).map(([k, v]) => [k, v.length]));

  const status = useSelector(selectBooksStatus);
  const libraryStatus = useSelector(selectLibrary).status;
  const loading = ["idle", "loading"].includes(status) || libraryStatus === "loading";

  const { items, page, totalPages } = paginate(lists[tab], Number(params.get("page")), PAGE_SIZE);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, tab]);

  const { icon, title, text } = EMPTY[tab];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold text-zinc-900">My Library</h1>
        <p className="text-sm text-zinc-500">Everything you’re reading, finished and saved.</p>
      </div>

      <LibraryTabs active={tab} counts={counts} onSelect={(key) => setParams({ tab: key })} />

      {!loading && items.length === 0 ? (
        <EmptyState icon={icon} title={title} text={text} />
      ) : (
        <BookGrid books={items} loading={loading} />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={(p) => setParams(p > 1 ? { tab, page: String(p) } : { tab })}
      />
    </div>
  );
}
