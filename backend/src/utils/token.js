import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signToken = (userId) => jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);

const cookieOptions = () => ({
  httpOnly: true, // not readable from JavaScript (protects against XSS token theft)
  secure: env.isProd || env.cookieSameSite === "none",
  sameSite: env.cookieSameSite,
  path: "/",
});

/** Sets the JWT cookie and returns the token (the frontend also keeps it for the Bearer header). */
export function sendTokenCookie(res, userId) {
  const token = signToken(userId);
  res.cookie(env.cookieName, token, {
    ...cookieOptions(),
    maxAge: env.cookieExpiresDays * 24 * 60 * 60 * 1000,
  });
  return token;
}

export const clearTokenCookie = (res) => res.clearCookie(env.cookieName, cookieOptions());
