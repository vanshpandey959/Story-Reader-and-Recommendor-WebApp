export default function EmptyState({ icon: Icon, title, text, children }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-12 text-center shadow-lg shadow-black/5">
      {Icon && (
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-green-800 shadow-md">
          <Icon className="h-6 w-6" />
        </span>
      )}
      <h3 className="font-display text-lg font-bold text-zinc-900">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-sm text-zinc-500">{text}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
