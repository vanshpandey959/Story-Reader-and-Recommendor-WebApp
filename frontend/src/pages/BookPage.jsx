import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BookX, Star } from "lucide-react";
import BookCover3D from "../components/books/BookCover3D";
import BookActions from "../components/books/BookActions";
import BookMeta from "../components/books/BookMeta";
import BookLane from "../components/books/BookLane";
import EmptyState from "../components/common/EmptyState";
import { BookPageSkeleton } from "../components/common/Skeletons";
import { selectBookById, selectBooks, selectBooksStatus } from "../store/selectors";
import { getSimilar } from "../utils/recommend";

export default function BookPage() {
  const { id } = useParams();
  const book = useSelector(selectBookById(id));
  const books = useSelector(selectBooks);
  const status = useSelector(selectBooksStatus);

  const similar = useMemo(() => (book ? getSimilar(book, books) : []), [book, books]);

  if (status === "idle" || status === "loading") return <BookPageSkeleton />;

  if (!book) {
    return (
      <EmptyState icon={BookX} title="Book not found" text="This story may have been removed.">
        <Link to="/explore" className="rounded-full bg-green-900 px-5 py-2 text-sm font-medium text-white hover:bg-green-200 hover:text-green-900">
          Back to Explore
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-2xl bg-white p-6 shadow-lg shadow-black/5 sm:p-8 lg:grid-cols-[18rem_1fr] lg:gap-12">
        <BookCover3D book={book} />

        <div className="flex min-w-0 flex-col gap-6">
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl lg:text-5xl">{book.title}</h1>
            {book.rating && (
              <p className="mt-3 flex items-center gap-1 text-sm text-zinc-600">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {book.rating.toFixed(1)}
              </p>
            )}
          </div>

          <BookActions book={book} />

          <BookMeta
            book={book}
            className="grid gap-x-8 gap-y-5 border-t border-zinc-100 pt-6 sm:grid-cols-2 xl:grid-cols-3"
          />

          <div className="border-t border-zinc-100 pt-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">Description</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700 sm:text-base">{book.description}</p>
          </div>
        </div>
      </section>

      <BookLane
        title="Similar books"
        books={similar}
        viewAllTo={book.genres[0] ? `/explore?genre=${encodeURIComponent(book.genres[0])}` : "/explore"}
        emptyText="No similar stories yet."
      />
    </div>
  );
}
