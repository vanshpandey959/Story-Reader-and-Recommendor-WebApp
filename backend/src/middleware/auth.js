import { env } from "../config/env.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/token.js";

/** Token from the httpOnly cookie, or from "Authorization: Bearer <token>" */
const readToken = (req) => {
  if (req.cookies?.[env.cookieName]) return req.cookies[env.cookieName];
  const header = req.headers.authorization;
  return header?.startsWith("Bearer ") ? header.slice(7) : null;
};

/** Routes that need a logged-in user. Sets req.user. */
export const protect = asyncHandler(async (req, _res, next) => {
  const token = readToken(req);
  if (!token) throw new ApiError(401, "Please log in to continue");

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, "Your session has expired. Please log in again");
  }

  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, "This account no longer exists");

  req.user = user;
  next();
});
