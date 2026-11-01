const pad = (n) => String(n).padStart(2, "0");

export const getClockParts = (d) => ({
  h: pad(d.getHours()),
  m: pad(d.getMinutes()),
  s: pad(d.getSeconds()),
});

export const formatLongDate = (d) =>
  d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export const greeting = (d) => {
  const h = d.getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

export const getInitials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
