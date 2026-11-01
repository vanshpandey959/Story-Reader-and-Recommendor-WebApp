import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import useBookStatus from "../../hooks/useBookStatus";
import StatusBadge from "./StatusBadge";

export default function BookCard({ book }) {
  const { status, isSaved, toggleSave } = useBookStatus(book.id);

  return (
    <div className="group relative w-full rounded-lg bg-white p-1 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/book/${book.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-md shadow-md">
          <img
            src={book.cover}
            alt={book.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          {/* dark spine for the 3D book look */}
          <div className="absolute left-0 top-0 h-full w-2 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute left-2 top-0 h-full w-px bg-white/30" />

          <div className="absolute left-4 top-2">
            <StatusBadge status={status} />
          </div>
        </div>

        <div className="px-2 pb-2 pt-2">
          <h3 className="truncate text-sm font-semibold text-zinc-900">{book.title}</h3>
          <p className="truncate text-xs text-zinc-500">by {book.author}</p>
        </div>
      </Link>

      <button
        onClick={toggleSave}
        aria-label={isSaved ? "Remove from saved" : "Save book"}
        aria-pressed={isSaved}
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-green-200"
      >
        <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : "text-zinc-500"}`} />
      </button>
    </div>
  );
}
