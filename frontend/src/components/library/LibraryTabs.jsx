import { Bookmark, BookOpen, CheckCircle2 } from "lucide-react";

export const LIBRARY_TABS = [
  { key: "reading", label: "Reading", icon: BookOpen },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
  { key: "saved", label: "Saved", icon: Bookmark },
];

export default function LibraryTabs({ active, counts, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {LIBRARY_TABS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          aria-pressed={active === key}
          className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            active === key
              ? "bg-green-800 text-white shadow"
              : "bg-white text-zinc-700 shadow-sm hover:bg-green-200"
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
          <span className="text-xs opacity-70">{counts[key]}</span>
        </button>
      ))}
    </div>
  );
}
