import { ChevronLeft, ChevronRight } from "lucide-react";
import { pageRange } from "../../utils/pagination";

const base = "flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-medium transition";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={`${base} bg-white shadow-sm hover:bg-green-200 disabled:opacity-40 disabled:hover:bg-white`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pageRange(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-zinc-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`${base} ${
              p === page
                ? "bg-green-800 text-white shadow"
                : "bg-white shadow-sm hover:bg-green-200"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={`${base} bg-white shadow-sm hover:bg-green-200 disabled:opacity-40 disabled:hover:bg-white`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
