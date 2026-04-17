import { Router } from "express";
import { SubscriptionController } from "../controllers/SubscriptionController";
import { idempotencyMiddleware } from "../middlewares/idempotency";

const router = Router();
const subscriptionController = new SubscriptionController();

// POST /api/subscriptions - subscribe a user to a plan (idempotent)
router.post("/", idempotencyMiddleware, subscriptionController.subscribe.bind(subscriptionController));

// GET /api/subscriptions/:id - get subscription details
router.get("/:id", subscriptionController.getById.bind(subscriptionController));

// GET /api/subscriptions/user/:userId - get active subscription by user id
router.get("/user/:userId", subscriptionController.getByUserId.bind(subscriptionController));

// PATCH /api/subscriptions/:id/upgrade - upgrade or downgrade plan
router.patch("/:id/upgrade", subscriptionController.upgrade.bind(subscriptionController));

// PATCH /api/subscriptions/:id/cancel - cancel subscription
router.patch("/:id/cancel", subscriptionController.cancel.bind(subscriptionController));

// POST /api/subscriptions/renew - triggered by scheduler
router.post("/renew", subscriptionController.renew.bind(subscriptionController));

export default router;
