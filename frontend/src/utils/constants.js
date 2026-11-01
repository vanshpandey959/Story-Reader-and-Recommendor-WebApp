// Random web image for now - swap with your own later
export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1800&q=80";

export const PAGE_SIZE = 18; // books per page on Explore / Library
export const LANE_SIZE = 32; // books per lane on Home

export const READ_STATUS = {
  NONE: "none",
  READING: "reading",
  COMPLETED: "completed",
};

export const STORAGE_KEYS = {
  token: "sr_token",
  user: "sr_user",
  mockUsers: "sr_mock_users",
  library: (userId) => `sr_library_${userId}`,
};

export const FALLBACK_COVER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#166534"/><stop offset="1" stop-color="#14532d"/></linearGradient></defs><rect width="300" height="400" fill="url(#g)"/><text x="150" y="210" font-family="Georgia" font-size="22" fill="#dcfce7" text-anchor="middle">No cover</text></svg>`
  );
