export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   * @param {string} code
   * @param {Array<any>} details
   */
  constructor(message, statusCode = 500, code = "INTERNAL_SERVER_ERROR", details = []) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details = []) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details = []) {
    super(message, 400, "BAD_REQUEST", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details = []) {
    super(message, 409, "CONFLICT", details);
  }
}
