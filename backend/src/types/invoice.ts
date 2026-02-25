import { InvoiceStatus } from "../enums/invoiceStatus"

export interface Invoice {
  id: string
  subscriptionId: string
  amount: number
  currency: string
  status: InvoiceStatus
  createdAt: Date
  updatedAt: Date
}
