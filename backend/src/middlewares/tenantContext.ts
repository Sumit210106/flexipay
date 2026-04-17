import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/AppError";

// Extends Express Request to carry tenantId throughout the request lifecycle
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}

export function tenantContext(req: Request, _res: Response, next: NextFunction): void {
  const tenantId = req.headers["x-tenant-id"] as string | undefined;

  if (!tenantId) {
    throw new BadRequestError("Missing required header: x-tenant-id");
  }

  req.tenantId = tenantId;
  next();
}
