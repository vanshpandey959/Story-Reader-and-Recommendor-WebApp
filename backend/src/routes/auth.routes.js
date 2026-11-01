import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, logout, me, signup } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, signupSchema } from "../validators/auth.validators.js";

const router = Router();

// slow down password guessing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

router.post("/signup", authLimiter, validate(signupSchema), signup);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
