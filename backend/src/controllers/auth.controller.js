import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { clearTokenCookie, sendTokenCookie } from "../utils/token.js";

/** POST /api/auth/signup  { name, email, password }  ->  201 { user, token } (+ httpOnly cookie) */
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (await User.exists({ email })) throw new ApiError(409, "An account with this email already exists");

  const user = await User.create({ name, email, password });
  const token = sendTokenCookie(res, user._id);
  res.status(201).json({ user, token });
});

/** POST /api/auth/login  { email, password }  ->  { user, token } (+ httpOnly cookie) */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  // same message for "no such user" and "wrong password" so emails can't be probed
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, "Incorrect email or password");

  const token = sendTokenCookie(res, user._id);
  res.json({ user, token });
});

/** POST /api/auth/logout - clears the cookie */
export const logout = asyncHandler(async (_req, res) => {
  clearTokenCookie(res);
  res.json({ message: "Logged out" });
});

/** GET /api/auth/me - who is logged in (used to restore a session from the cookie) */
export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
