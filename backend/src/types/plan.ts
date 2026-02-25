export interface Plan {
  id: string
  name: string
  price: number
  currency: string
  interval: string
  organizationId: string
  createdAt: Date
  updatedAt: Date
}