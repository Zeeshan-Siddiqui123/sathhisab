import { ZodError } from "zod";

/**
 * Validates request data against Zod schemas
 * @param {{ body?: import("zod").ZodSchema, query?: import("zod").ZodSchema, params?: import("zod").ZodSchema }} schemas
 */
export function validate(schemas) {
  return (req, _res, next) => {
    try {
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
