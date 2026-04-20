/**
 * validate.js — Request Body Validation Middleware
 *
 * A lightweight, dependency-free middleware that validates required
 * fields in an incoming request body. Returns a 400 Bad Request
 * response immediately if any required field is missing or empty,
 * preventing invalid data from ever reaching the database.
 *
 * Usage:
 *   import { requireFields } from "../middleware/validate.js";
 *
 *   router.post("/", verifyToken, requireFields(["title", "description", "price", "category"]), createGig);
 *
 * Contributed by: Chetan Chauhan
 */

/**
 * Returns an Express middleware that checks the request body
 * for the specified required fields.
 *
 * @param {string[]} fields - Array of field names that must be present and non-empty
 * @returns {Function} Express middleware function
 */
export const requireFields = (fields) => (req, res, next) => {
  const missing = fields.filter((field) => {
    const value = req.body[field];
    // Treat undefined, null, and empty strings as missing
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missing.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      missing,
      message: `The following fields are required: ${missing.join(", ")}`,
    });
  }

  next();
};

/**
 * Returns an Express middleware that ensures a numeric field
 * is a positive integer greater than zero.
 *
 * @param {string} field - The field name to validate as a positive number
 * @returns {Function} Express middleware function
 */
export const requirePositiveNumber = (field) => (req, res, next) => {
  const value = Number(req.body[field]);

  if (isNaN(value) || value <= 0) {
    return res.status(400).json({
      error: "Validation failed",
      message: `'${field}' must be a positive number greater than zero`,
    });
  }

  next();
};
