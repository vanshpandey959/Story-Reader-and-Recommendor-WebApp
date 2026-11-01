import "dotenv/config";

const required = ["MONGO_URI", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}. Copy .env.example to .env first.`);
  process.exit(1);
}

const isProd = process.env.NODE_ENV === "production";

export const env = {
  isProd,
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieName: process.env.COOKIE_NAME || "sr_token",
  cookieExpiresDays: Number(process.env.COOKIE_EXPIRES_DAYS) || 7,
  cookieSameSite: process.env.COOKIE_SAMESITE || "lax",
  clientUrls: (process.env.CLIENT_URL || "http://localhost:5173").split(",").map((s) => s.trim()),
  seedFile: process.env.SEED_FILE || "./data/data.json",
};
