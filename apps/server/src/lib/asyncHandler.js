/**
 * Wraps an async route handler to forward unhandled errors to Express next()
 * @param {Function} fn
 * @returns {Function}
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
