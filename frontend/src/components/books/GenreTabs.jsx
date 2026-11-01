const pill = "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition";

export default function GenreTabs({ genres, active, onSelect }) {
  const items = [{ name: "All" }, ...genres];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map(({ name, count }) => (
        <button
          key={name}
          onClick={() => onSelect(name)}
          aria-pressed={active === name}
          className={`${pill} ${
            active === name
              ? "bg-green-800 text-white shadow"
              : "bg-white text-zinc-700 shadow-sm hover:bg-green-200"
          }`}
        >
          {name}
          {count != null && <span className="ml-1.5 text-xs opacity-60">{count}</span>}
        </button>
      ))}
    </div>
  );
}
