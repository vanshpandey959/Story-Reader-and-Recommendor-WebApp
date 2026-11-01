import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { selectGenres } from "../../store/selectors";

const colTitle = "mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400";
const linkCls = "block py-1 text-sm text-zinc-600 transition hover:text-zinc-950";

export default function Footer() {
  const genres = useSelector(selectGenres).slice(0, 5);

  return (
    <footer className="mt-12 overflow-hidden rounded-2xl bg-white text-zinc-600 shadow-lg shadow-black/5">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm text-zinc-500">
            Short stories for every mood. Read online, keep track of what you finish and find your next favourite.
          </p>
        </div>

        <div>
          <p className={colTitle}>Discover</p>
          <Link to="/" className={linkCls}>Home</Link>
          <Link to="/explore" className={linkCls}>Explore</Link>
          <Link to="/library" className={linkCls}>My Library</Link>
        </div>

        <div>
          <p className={colTitle}>Genres</p>
          {genres.map((g) => (
            <Link key={g.name} to={`/explore?genre=${encodeURIComponent(g.name)}`} className={linkCls}>
              {g.name}
            </Link>
          ))}
        </div>

        <div>
          <p className={colTitle}>Contact</p>
          <p className="text-xs text-zinc-400">Books courtesy of Project Gutenberg.</p>
        </div>
      </div>

      <div className="px-6 py-4 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} Made with <Heart className="mx-0.5 inline h-3 w-3 fill-rose-400 text-rose-400" /> for readers.
      </div>
    </footer>
  );
}
