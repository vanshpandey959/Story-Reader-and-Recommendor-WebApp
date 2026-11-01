import { env } from "../config/env.js";
import ApiError from "../utils/ApiError.js";

export const notFound = (req, _res, next) => next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message || "Something went wrong";

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)[0]?.message ?? message;
  } else if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}`;
  } else if (err.code === 11000) {
    status = 409;
    message = "That value already exists";
  }

  if (status >= 500) console.error(err);

  res.status(status).json({
    message: status >= 500 && env.isProd ? "Something went wrong" : message,
    ...(err.details && { details: err.details }),
    ...(!env.isProd && status >= 500 && { stack: err.stack }),
  });
};
