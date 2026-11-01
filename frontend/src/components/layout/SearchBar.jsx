import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

export default function SearchBar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";

  const onSubmit = (e) => {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get("q").trim();
    navigate(value ? `/explore?q=${encodeURIComponent(value)}` : "/explore");
  };

  // key={q} re-syncs the input when the URL changes
  return (
    <form key={q} onSubmit={onSubmit} role="search" className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      <input
        name="q"
        defaultValue={q}
        placeholder="Search title or author…"
        className="w-full rounded-full bg-white py-2 pl-9 pr-4 text-sm shadow-md outline-none transition focus:shadow-lg focus:ring-2 focus:ring-green-600/40"
      />
    </form>
  );
}
