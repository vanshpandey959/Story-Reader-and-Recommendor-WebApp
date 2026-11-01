import ApiError from "../utils/ApiError.js";

/** validate(zodSchema) -> checks req.body and replaces it with the cleaned values */
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const issues = result.error.issues.map((i) => ({ field: i.path.join("."), message: i.message }));
    return next(new ApiError(400, issues[0].message, issues));
  }
  req.body = result.data;
  next();
};
