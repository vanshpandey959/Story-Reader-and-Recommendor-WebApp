import { Loader2 } from "lucide-react";

export default function PageLoader({ fullScreen = false }) {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : "min-h-[40vh]"}`}>
      <Loader2 className="h-8 w-8 animate-spin text-green-800" />
    </div>
  );
}
