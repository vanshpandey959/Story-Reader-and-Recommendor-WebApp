import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CloudOff, X } from "lucide-react";
import BookGrid from "../components/books/BookGrid";
import GenreTabs from "../components/books/GenreTabs";
import Pagination from "../components/common/Pagination";
import EmptyState from "../components/common/EmptyState";
import { loadBooks } from "../store/slices/booksSlice";
import { selectBooks, selectBooksStatus, selectGenres } from "../store/selectors";
import { filterBooks } from "../utils/filter";
import { paginate } from "../utils/pagination";
import { PAGE_SIZE } from "../utils/constants";

export default function ExplorePage() {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const books = useSelector(selectBooks);
  const genres = useSelector(selectGenres);
  const status = useSelector(selectBooksStatus);

  const genre = params.get("genre") ?? "All";
  const query = params.get("q") ?? "";
  const loading = status === "idle" || status === "loading";

  const filtered = useMemo(() => filterBooks(books, { genre, query }), [books, genre, query]);
  const { items, page, totalPages } = paginate(filtered, Number(params.get("page")), PAGE_SIZE);

  // URL is the single source of truth: ?genre=Horror&q=poe&page=2
  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, genre, query]);

  if (status === "failed") {
    return (
      <EmptyState icon={CloudOff} title="Couldn't load stories" text="Check your connection and try again.">
        <button onClick={() => dispatch(loadBooks())} className="rounded-full bg-green-900 px-5 py-2 text-sm font-medium text-white hover:bg-green-200 hover:text-green-900">
          Retry
        </button>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold text-zinc-900">Explore</h1>
        <p className="text-sm text-zinc-500">
          {loading ? "Loading stories…" : `${filtered.length} ${filtered.length === 1 ? "story" : "stories"}`}
          {genre !== "All" && ` in ${genre}`}
        </p>
      </div>

      <GenreTabs genres={genres} active={genre} onSelect={(g) => update({ genre: g === "All" ? "" : g, page: "" })} />

      {query && (
        <button
          onClick={() => update({ q: "", page: "" })}
          className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm text-green-900 shadow-md transition hover:bg-green-200"
        >
          Search: “{query}”
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      <BookGrid
        books={items}
        loading={loading}
        emptyTitle="No stories match"
        emptyText="Try a different genre or search term."
      />

      <Pagination page={page} totalPages={totalPages} onChange={(p) => update({ page: p > 1 ? String(p) : "" })} />
    </div>
  );
}
