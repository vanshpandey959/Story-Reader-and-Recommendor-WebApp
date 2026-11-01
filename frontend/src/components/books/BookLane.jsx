import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookCard from "./BookCard";
import { BookCardSkeleton } from "../common/Skeletons";

// 2 / 3 / 4 / 5 / 6 books visible depending on screen width (gap-4 = 1rem)
const ITEM_WIDTH =
  "w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)] xl:w-[calc((100%-4rem)/5)] 2xl:w-[calc((100%-5rem)/6)]";

const arrowCls =
  "absolute top-1/3 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-green-200 hover:shadow-lg sm:flex";

export default function BookLane({ title, books, loading = false, viewAllTo, emptyText }) {
  const laneRef = useRef(null);

  // move exactly one book (card width + gap)
  const scroll = (direction) => {
    const lane = laneRef.current;
    const card = lane.firstElementChild;
    if (!card) return;
    lane.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: "smooth" });
  };

  return (
    <section className="w-full rounded-2xl bg-white p-4 shadow-lg shadow-black/5 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-zinc-900">{title}</h2>
        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="flex items-center gap-0.5 text-sm font-medium rounded-full px-2 py-1 text-zinc-800 transition hover:bg-green-200"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {!loading && books.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-zinc-600">
          {emptyText ?? "Nothing here yet."}
        </p>
      ) : (
        <div className="relative">
          <button onClick={() => scroll(-1)} aria-label="Scroll left" className={`${arrowCls} -left-3`}>
            <ChevronLeft className="h-5 w-5 text-zinc-700" />
          </button>

          <div
            ref={laneRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {loading
              ? Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className={`${ITEM_WIDTH} shrink-0`}>
                    <BookCardSkeleton />
                  </div>
                ))
              : books.map((book) => (
                  <div key={book.id} className={`${ITEM_WIDTH} shrink-0 snap-start`}>
                    <BookCard book={book} />
                  </div>
                ))}
          </div>

          <button onClick={() => scroll(1)} aria-label="Scroll right" className={`${arrowCls} -right-3`}>
            <ChevronRight className="h-5 w-5 text-zinc-700" />
          </button>
        </div>
      )}
    </section>
  );
}
