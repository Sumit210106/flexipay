# FlexiPay

A headless, multi-tenant Subscription and Billing Engine built with Node.js, Express, TypeScript, MongoDB, and a minimal React/Tailwind frontend.

## Architecture

FlexiPay demonstrates Clean Architecture principles and SOLID design patterns:

- **State Pattern**: The `SubscriptionEntity` encapsulates states (`Trialing`, `Active`, `PastDue`, `Canceled`) to prevent invalid lifecycle transitions without using sprawling `switch` statements.
- **Strategy Pattern**: `FlatRateBillingStrategy` and `ProrationBillingStrategy` handle pricing calculations dynamically based on context.
- **Adapter Pattern**: The `IPaymentGateway` port decouples the core logic from external providers (e.g. Stripe, mocked in-process for development).
- **Repository Pattern**: Domain logic depends on data-access interfaces (`ISubscriptionRepository`), not Mongoose models directly.

## Features

- **Multi-Tenancy**: Logical isolation via `tenantId`.
- **Payment Integrity**: Safe retries using Idempotency Keys (`IdempotencyService`). Core billing/invoice generation occurs inside a MongoDB ACID transaction.
- **Proration**: Intelligent mid-cycle upgrades/downgrades calculating credits dynamically.

## Getting Started

You need MongoDB installed/accessible via URI.

### 1. Backend Setup

```bash
cd backend
npm install
# Ensure .env is set with MONGO_URI, PORT, CLIENT_URL
npm run dev
```

To populate the database with a test Organization, User, and Plan:
```bash
npm run seed
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. 
The homepage allows you to log in as a Tenant Admin (to create plans and view webhooks) or a Subscriber (to view pricing, subscribe, upgrade, and cancel).

### Simulating Webhooks
The frontend includes a Webhook Simulator. As a Tenant Admin, navigate to Webhooks and send mock `payment.succeeded` or `payment.failed` events to test the backend's async processing.
