import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import EmptyState from "../components/common/EmptyState";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg items-center p-6">
      <EmptyState icon={Compass} title="Page not found" text="This page isn't on any shelf.">
        <Link to="/" className="rounded-full bg-green-900 px-5 py-2 text-sm font-medium text-white hover:bg-green-200 hover:text-green-900">
          Go home
        </Link>
      </EmptyState>
    </div>
  );
}
