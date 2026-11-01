export default function AuthField({ label, icon: Icon, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          required
          {...inputProps}
          className="w-full rounded-lg bg-white py-2.5 pl-9 pr-3 text-sm shadow-md outline-none transition focus:shadow-lg focus:ring-2 focus:ring-green-600/40"
        />
      </span>
    </label>
  );
}
