import { Request, Response, NextFunction } from "express";

/**
 * Minimal structured request logger.
 *
 * Logs: method, URL, status code, and response time on each request.
 * In a production system this would be replaced by a proper logger
 * (e.g. pino) piped into a log aggregator, but this keeps the project
 * dependency-free while still having observability during development.
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const tenantId = req.headers["x-tenant-id"] ?? "-";

    const level = status >= 500 ? "ERROR" : status >= 400 ? "WARN" : "INFO";

    console.log(
      `[${level}] ${new Date().toISOString()} | ${method} ${originalUrl} | ${status} | ${duration}ms | tenant=${tenantId}`
    );
  });

  next();
}
