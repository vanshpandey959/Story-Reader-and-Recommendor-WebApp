import { useState } from "react";
import { ArrowUpRight, Bookmark, Check, CheckCircle2, Download, Share2 } from "lucide-react";
import useBookStatus from "../../hooks/useBookStatus";
import { READ_STATUS } from "../../utils/constants";

const iconBtn =
  "flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-600 shadow-md transition hover:bg-green-200 hover:shadow-lg";

export default function BookActions({ book }) {
  const { status, isSaved, start, complete, toggleSave } = useBookStatus(book.id);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  const readLabel =
    status === READ_STATUS.READING ? "Continue reading" : status === READ_STATUS.COMPLETED ? "Read again" : "Start reading";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {book.readUrl ? (
          <a
            href={book.readUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!start()) e.preventDefault(); // guests log in first
            }}
            className="flex items-center gap-1.5 rounded-full bg-green-900 px-5 py-2.5 text-sm font-medium text-white shadow transition hover:bg-green-200 hover:text-green-900"
          >
            {readLabel}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : (
          <span className="rounded-full bg-zinc-200 px-5 py-2.5 text-sm text-zinc-500">No reading link</span>
        )}

        {status === READ_STATUS.READING && (
          <button
            onClick={complete}
            className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-green-800 shadow-md transition hover:bg-green-200 hover:shadow-lg"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark as completed
          </button>
        )}

        {status === READ_STATUS.COMPLETED && (
          <span className="flex items-center gap-1.5 rounded-full bg-green-600 px-4 py-2.5 text-sm font-medium text-white">
            <CheckCircle2 className="h-4 w-4" />
            Completed
          </span>
        )}

        <button onClick={toggleSave} aria-label={isSaved ? "Remove from saved" : "Save book"} aria-pressed={isSaved} className={iconBtn}>
          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-green-800 text-green-800" : ""}`} />
        </button>
        <button onClick={share} aria-label="Copy link" className={iconBtn}>
          {copied ? <Check className="h-4 w-4 text-green-700" /> : <Share2 className="h-4 w-4" />}
        </button>
        {book.downloadUrl && (
          <a href={book.downloadUrl} target="_blank" rel="noopener noreferrer" aria-label="Download" className={iconBtn}>
            <Download className="h-4 w-4" />
          </a>
        )}
      </div>

      {status === READ_STATUS.READING && (
        <p className="text-xs text-zinc-500">
          This story stays in <b>Continue Reading</b> until you mark it as completed.
        </p>
      )}
    </div>
  );
}