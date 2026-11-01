export function BookCardSkeleton() {
  return (
    <div className="w-full animate-pulse rounded-lg bg-white p-1 shadow-md">
      <div className="aspect-[3/4] rounded-md bg-zinc-200" />
      <div className="space-y-2 px-2 pb-2 pt-3">
        <div className="h-3 w-4/5 rounded bg-zinc-200" />
        <div className="h-3 w-1/2 rounded bg-zinc-200" />
      </div>
    </div>
  );
}

export function BookPageSkeleton() {
  return (
    <div className="grid animate-pulse gap-10 lg:grid-cols-[18rem_1fr]">
      <div className="aspect-[3/4] rounded-md bg-zinc-200" />
      <div className="space-y-4">
        <div className="h-10 w-2/3 rounded bg-zinc-200" />
        <div className="h-4 w-1/4 rounded bg-zinc-200" />
        <div className="h-24 rounded bg-zinc-200" />
        <div className="h-10 w-48 rounded-full bg-zinc-200" />
      </div>
    </div>
  );
}
