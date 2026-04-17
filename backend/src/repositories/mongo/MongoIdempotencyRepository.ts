import { IdempotencyKeyModel, IdempotencyKeyDocument } from "../../models/idempotencyKey.model";

export class MongoIdempotencyRepository {
  async findByKey(key: string): Promise<IdempotencyKeyDocument | null> {
    return IdempotencyKeyModel.findOne({ key });
  }

  async save(key: string, requestHash: string, responseSnapshot: string): Promise<IdempotencyKeyDocument> {
    return IdempotencyKeyModel.create({ key, requestHash, responseSnapshot });
  }

  async exists(key: string): Promise<boolean> {
    const doc = await IdempotencyKeyModel.findOne({ key }, { _id: 1 });
    return doc !== null;
  }
}
