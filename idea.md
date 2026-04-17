# FlexiPay: Multi-Tenant Subscription & Billing Engine

## 1. Overview

FlexiPay is a backend-driven Subscription and Billing Engine built for modern SaaS platforms.

Instead of depending entirely on third-party payment gateways to manage subscription logic, FlexiPay treats billing as a first-class internal system. It models subscription states internally using the State Pattern, handles recurring payments via the Strategy Pattern, calculates mid-cycle proration, and ensures financial data consistency through transactional operations.

The goal of this project is to design a structured, extensible, and SOLID-compliant billing system using clean architectural practices.

## 2. Motivation

In many SaaS applications, subscription handling is tightly coupled with external payment providers. This often results in:

**Limited Control:** Difficulty managing custom lifecycle rules.

**Proration Pain:** Hard to handle mid-cycle upgrades or downgrades accurately.

**Double Charging:** Risk of duplicate charges due to network retries or lack of idempotency.

**Vendor Lock-in:** Rigid integration makes switching payment providers expensive.

FlexiPay addresses these by introducing a decoupled billing layer that manages business rules internally while integrating with gateways via Clean Abstractions.

## 3. Core Capabilities

**Multi-Tenancy:** Logical isolation at the database level using a `tenant_id` discriminator to ensure data privacy.

**State-Driven Lifecycle:** Manages states (Trialing, Active, PastDue, Canceled) where each state encapsulates its own behavior, preventing invalid transitions.

**Proration Engine:** Automated calculation of credits and charges during plan changes to ensure fair billing.

**Pluggable Payments:** A Strategy-based abstraction layer allowing the system to support multiple gateways (Stripe, PayPal) without modifying core logic (Open/Closed Principle).

**Financial Integrity:** Execution of critical state changes inside MongoDB ACID transactions with idempotency keys to prevent duplicate billing.

**Webhook Synchronization:** Real-time event handling to keep internal records in sync with external payment confirmations.

## 4. Architectural Approach

The system implements a Hexagonal (Ports and Adapters) architecture to ensure the business logic remains pure and independent of technical details.

**Domain Models:** Core entities (Subscription, Plan, Invoice) that contain the business rules and state logic.

**Application Services:** Use cases (e.g., SubscribeUser, ProcessRenewal) that orchestrate the flow.

**Infrastructure Adapters:** Implementation details for database access (Repositories) and external API communication (Gateway Adapters).

**Applied Design Patterns:**

- **State Pattern:** For subscription lifecycle transitions.
- **Strategy Pattern:** For payment gateway logic and billing calculations.
- **Adapter Pattern:** To wrap third-party SDKs into internal interfaces.
- **Dependency Inversion:** High-level billing logic depends on interfaces, not concrete implementations.

## 5. Technology Stack

**Backend:** Node.js, Express.js, TypeScript (Strict Mode).

**Database:** MongoDB with Mongoose (Transaction Support).

**Frontend:** React with TypeScript (Minimal admin/subscriber dashboard).

## 6. Engineering Goals

**Clean Architecture:** Strict separation between business logic and external frameworks.

**Robustness:** Transaction-safe financial workflows.

**Scalability:** Easy to add new payment methods or complex billing tiers (e.g., usage-based).

**Testability:** High unit test coverage on the internal Domain logic.
