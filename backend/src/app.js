import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/error.js";

const app = express();

// Render / Heroku etc. sit behind a proxy: needed so rate limiting sees the real client IP
if (env.isProd) app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: env.clientUrls,
    credentials: true, // lets the browser send / receive the auth cookie
  })
);
app.use(compression()); // /api/books returns the whole catalogue, so gzip matters
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
if (!env.isProd) app.use(morgan("dev"));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;