import { Router } from "express";
import { getBook, getBooks, getGenres, getPopularBooks, getSimilarBooks } from "../controllers/book.controller.js";

const router = Router();

// public - no login needed. Fixed paths go before "/:id".
router.get("/", getBooks);
router.get("/popular", getPopularBooks);
router.get("/genres", getGenres);
router.get("/:id/similar", getSimilarBooks);
router.get("/:id", getBook);

export default router;
