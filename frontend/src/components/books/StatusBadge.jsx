import { BookOpen, CheckCircle2 } from "lucide-react";
import { READ_STATUS } from "../../utils/constants";

const STYLES = {
  [READ_STATUS.NONE]: { label: "Read now", cls: "bg-white text-zinc-700" },
  [READ_STATUS.READING]: { label: "Reading", icon: BookOpen, cls: "bg-amber-100 text-amber-900" },
  [READ_STATUS.COMPLETED]: { label: "Completed", icon: CheckCircle2, cls: "bg-green-600 text-white" },
};

export default function StatusBadge({ status }) {
  const { label, icon: Icon, cls } = STYLES[status] ?? STYLES[READ_STATUS.NONE];
  return (
    <span
      className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-md ${cls}`}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </span>
  );
}
