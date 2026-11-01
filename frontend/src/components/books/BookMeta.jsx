import { Link } from "react-router-dom";

function Row({ label, children }) {
  if (!children) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-zinc-800">{children}</dd>
    </div>
  );
}

const ALL_FIELDS = ["author", "genres", "language", "pages", "year"];

/** `fields` picks which rows to show, so the list can be split across the page. */
export default function BookMeta({ book, fields = ALL_FIELDS, className = "space-y-4" }) {
  const show = (f) => fields.includes(f);

  return (
    <dl className={className}>
      {show("author") && <Row label="Author">{book.author}</Row>}
      {show("genres") && (
        <Row label="Genres">
          {book.genres.length > 0 && (
            <span className="flex flex-wrap gap-1.5">
              {book.genres.map((g) => (
                <Link
                  key={g}
                  to={`/explore?genre=${encodeURIComponent(g)}`}
                  className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-green-900 shadow-sm transition hover:bg-green-200"
                >
                  {g}
                </Link>
              ))}
            </span>
          )}
        </Row>
      )}
      {show("language") && <Row label="Language">{book.language}</Row>}
      {show("pages") && <Row label="Pages">{book.pages}</Row>}
      {show("year") && <Row label="Published">{book.year}</Row>}
    </dl>
  );
}
