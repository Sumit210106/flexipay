import express from "express";
import cors from "cors";
import { requestLogger } from "./middlewares/requestLogger";
import { errorHandler } from "./middlewares/errorHandler";
import planRouter from "./routes/plan.routes";
import subscriptionRouter from "./routes/subscription.routes";
import invoiceRouter from "./routes/invoice.routes";
import webhookRouter from "./routes/webhook.routes";

export const app = express();

// ── Core middleware ───────────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(requestLogger);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ success: true, status: "OK", timestamp: new Date().toISOString() });
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/plans", planRouter);
app.use("/api/subscriptions", subscriptionRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/webhooks", webhookRouter);

// ── Global error handler — must be last ──────────────────────────────────────
app.use(errorHandler);