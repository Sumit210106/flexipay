
export class AppError extends Error {
  public readonly statusCode: number;
  /**
   * `true`  → operational error (safe to send to client)
   * `false` → programmer error (log + return 500)
   */
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); 
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target);
    }
  }
}

// ─── HTTP-specific subclasses ────────────────────────────────────────────────

/** 400 — Malformed request body / invalid input */
export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

/** 404 — Resource not found */
export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404);
  }
}

/** 409 — Resource already exists or state conflict */
export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

/** 422 — Semantically invalid request (e.g., illegal state transition) */
export class UnprocessableError extends AppError {
  constructor(message = "Unprocessable Entity") {
    super(message, 422);
  }
}

/** 402 — Payment required / failed */
export class PaymentError extends AppError {
  constructor(message = "Payment failed") {
    super(message, 402);
  }
}
