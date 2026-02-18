# FlexiPay: Multi-Tenant Subscription & Billing Engine

## Overview

FlexiPay is a backend-driven Subscription and Billing Engine built for modern SaaS platforms. 

Instead of depending entirely on third-party payment gateways to manage subscription logic, FlexiPay treats billing as a first-class system. It models subscription states internally, handles recurring payments, calculates proration during plan changes, and ensures financial data consistency through transactional operations.

The goal of this project is not just to integrate payments, but to design a structured and extensible billing system using strong Object-Oriented Programming principles and clean architectural practices.

---

## Motivation

In many SaaS applications, subscription handling is tightly coupled with external payment providers. This often results in:

- Limited control over subscription lifecycle logic  
- Difficulty handling mid-cycle upgrades or downgrades  
- Duplicate charges due to network retries  
- Weak data consistency guarantees  
- Rigid integration when switching payment providers  

FlexiPay addresses these problems by introducing a dedicated billing layer that manages business rules internally while integrating with payment gateways in a controlled and abstracted manner.

---

## Core Capabilities

FlexiPay supports multiple merchant organizations, where each organization can define its own subscription plans and manage its own customers. The system maintains logical tenant isolation at the database level.

Subscribers can:

- Subscribe to plans  
- Upgrade or downgrade plans  
- Cancel subscriptions  
- View generated invoices  

The system manages subscription states such as Trialing, Active, PastDue, Canceled, and Incomplete. Each state encapsulates its own behavior, allowing transitions to be handled cleanly and predictably.

When a user changes plans mid-cycle, the system calculates proration based on the remaining time in the billing period and generates an adjusted invoice. This ensures fair and accurate billing.

Recurring billing operations are processed through a payment abstraction layer. Payment providers are implemented using a pluggable strategy-based approach, allowing the system to support multiple gateways without modifying core business logic.

To maintain financial integrity, critical operations such as subscription updates and invoice generation are executed inside MongoDB ACID transactions. Additionally, idempotency mechanisms ensure that repeated requests do not result in duplicate charges.

Webhook handling is also supported to synchronize external payment confirmations with internal system records.

---

## Architectural Approach

The backend follows a layered architecture consisting of:

- Controllers for handling HTTP requests  
- Services for business logic execution  
- Repository classes for database access  
- Domain models representing core entities  
- Strategy-based payment processors  

This structure promotes separation of concerns, maintainability, and testability.

Object-Oriented principles such as encapsulation, abstraction, and polymorphism are applied throughout the system. The State Pattern is used to model subscription lifecycle behavior, and the Strategy Pattern is used for payment gateway abstraction.

---

## Technology Stack

Backend:
- Node.js
- Express.js
- TypeScript 
- MongoDB with Mongoose 

Frontend:
- React with TypeScript
- Minimal dashboard for managing plans and subscriptions

---

## Engineering Goals

Through this project, the aim is to demonstrate:

- Clean backend architecture
- Proper application of OOP principles
- Practical use of design patterns
- Transaction-safe financial workflows
- Multi-tenant system modeling
- Scalable and extensible system design
