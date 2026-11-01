import { Router } from "express";
import authRoutes from "./auth.routes.js";
import bookRoutes from "./book.routes.js";
import libraryRoutes from "./library.routes.js";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok" }));
router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/library", libraryRoutes);

export default router;
