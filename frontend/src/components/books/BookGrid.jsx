import { SearchX } from "lucide-react";
import BookCard from "./BookCard";
import EmptyState from "../common/EmptyState";
import { BookCardSkeleton } from "../common/Skeletons";
import { PAGE_SIZE } from "../../utils/constants";

export default function BookGrid({ books, loading = false, emptyTitle = "No books found", emptyText }) {
  if (!loading && books.length === 0) {
    return <EmptyState icon={SearchX} title={emptyTitle} text={emptyText} />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {loading
        ? Array.from({ length: PAGE_SIZE }, (_, i) => <BookCardSkeleton key={i} />)
        : books.map((book) => <BookCard key={book.id} book={book} />)}
    </div>
  );
}
