import { Request, Response, NextFunction } from "express";
import { IdempotencyService } from "../services/IdempotencyService";
import { BadRequestError } from "../errors/AppError";

const idempotencyService = new IdempotencyService();

export async function idempotencyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const key = req.headers["idempotency-key"] as string | undefined;

  if (!key) {
    return next();
  }

  if (key.length < 8) {
    throw new BadRequestError("Idempotency-Key must be at least 8 characters");
  }

  const existing = await idempotencyService.getExistingResponse(key);

  if (existing) {
    // Replay the cached response
    res.status(200).json(JSON.parse(existing));
    return;
  }

  // Store the original json method and intercept it to cache the response
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    idempotencyService.checkAndStore(
      key,
      idempotencyService.hashRequest(req.body),
      JSON.stringify(body)
    ).catch(console.error);
    return originalJson(body);
  };

  next();
}
