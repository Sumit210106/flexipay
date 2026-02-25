export interface WebhookEvent {
  id: string
  type: string
  payload: Record<string, any>
  processed: boolean
  receivedAt: Date
}