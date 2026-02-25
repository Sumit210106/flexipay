export interface IdempotencyKey {
  id: string
  key: string
  requestHash: string
  responseSnapshot: string
  createdAt: Date
}