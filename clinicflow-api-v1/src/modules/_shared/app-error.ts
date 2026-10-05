export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: unknown;

  constructor(message: string, statusCode = 500, isOperational = true, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", errors?: unknown) {
    super(message, 400, true, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, true);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden: Access Denied") {
    super(message, 403, true);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource Not Found") {
    super(message, 404, true);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict: Resource already exists or violates constraint") {
    super(message, 409, true);
  }
}
