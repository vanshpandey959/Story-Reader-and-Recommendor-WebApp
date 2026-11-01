import { Router } from "express";
import { completeBook, getLibrary, startReading, toggleSaved } from "../controllers/library.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect); // everything here is personal

router.get("/", getLibrary);
router.post("/:bookId/start", startReading);
router.post("/:bookId/complete", completeBook);
router.post("/:bookId/save", toggleSaved);

export default router;
