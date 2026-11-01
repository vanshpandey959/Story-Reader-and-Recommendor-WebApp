import { useDispatch, useSelector } from "react-redux";
import { Menu, PanelLeftClose } from "lucide-react";
import SearchBar from "./SearchBar";
import { toggleSidebar } from "../../store/slices/uiSlice";
import { selectUser } from "../../store/selectors";
import { getInitials } from "../../utils/format";

/** One bar: menu | search | welcome + avatar. Same background as the sidebar, no border. */
export default function TopBar() {
  const dispatch = useDispatch();
  const open = useSelector((s) => s.ui.sidebarOpen);
  const user = useSelector(selectUser);
  const firstName = user?.name?.split(" ")[0];

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center gap-3 bg-paper px-4 sm:px-6">
      <button
        onClick={() => dispatch(toggleSidebar())}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
        className="flex h-10 w-10 shrink-0 translate-y-2 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-green-100"
      >
        {open ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className="flex flex-1 justify-center">
        <SearchBar />
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <span className="hidden text-sm text-zinc-600 md:block">
          Welcome, <b className="font-semibold text-zinc-900">{firstName}</b>
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-800 text-xs font-semibold text-white">
          {getInitials(user?.name)}
        </span>
      </div>
    </header>
  );
}