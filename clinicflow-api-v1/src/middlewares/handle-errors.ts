import { Request, Response, NextFunction } from "express";

export default function handleErrors(
  err: any,
  _req: Request,
  resp: Response,
  _next: NextFunction
) {
  if (err.name === "ZodError" || (err.issues && Array.isArray(err.issues))) {
    const firstIssue = err.issues?.[0];
    const message = firstIssue?.message || "Erreur de validation des données";
    return resp.status(400).json({
      success: false,
      status: 400,
      message,
      details: err.issues,
    });
  }

  const status = err.status || err.statusCode || 500;
  let message = err.message || "Something went wrong!";

  if (err.details && Array.isArray(err.details)) {
    message = err.details[0]?.message || message;
  }

  return resp.status(status).json({
    success: false,
    status,
    message,
    ...(err.details && { details: err.details }),
  });
}
