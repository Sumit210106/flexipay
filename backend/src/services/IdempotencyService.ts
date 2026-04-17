import crypto from "crypto";
import { MongoIdempotencyRepository } from "../repositories/mongo/MongoIdempotencyRepository";
import { ConflictError } from "../errors/AppError";

export class IdempotencyService {
  private repo: MongoIdempotencyRepository;

  constructor() {
    this.repo = new MongoIdempotencyRepository();
  }

  hashRequest(body: object): string {
    return crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex");
  }

  async checkAndStore(key: string, requestHash: string, responseSnapshot: string): Promise<string | null> {
    const existing = await this.repo.findByKey(key);

    if (existing) {
      if (existing.requestHash !== requestHash) {
        throw new ConflictError("Idempotency key reused with a different request body");
      }
      // Return cached response
      return existing.responseSnapshot;
    }

    await this.repo.save(key, requestHash, responseSnapshot);
    return null;
  }

  async getExistingResponse(key: string): Promise<string | null> {
    const existing = await this.repo.findByKey(key);
    return existing ? existing.responseSnapshot : null;
  }
}
