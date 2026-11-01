export function paginate(items, page, size) {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, page || 1), totalPages);
  return {
    page: current,
    totalPages,
    items: items.slice((current - 1) * size, current * size),
  };
}

/** [1, "…", 4, 5, 6, "…", 20] */
export function pageRange(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const list = [...new Set([1, total, page - 1, page, page + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out = [];
  list.forEach((p, i) => {
    if (i && p - list[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}
