import express from "express";
import { requestLogger } from "./middlewares/requestLogger";
import { errorHandler } from "./middlewares/errorHandler";

export const app = express();

// ── Core middleware ───────────────────────────────────────────────────────────
app.use(express.json());
app.use(requestLogger);

// ── Health check (framework-independent, no routing layer needed) ─────────────
app.get("/health", (_req, res) => {
  res.json({ success: true, status: "OK", timestamp: new Date().toISOString() });
});

// ── API routes will be mounted here in Phase 6 ────────────────────────────────
// app.use("/api/plans", planRouter);
// app.use("/api/subscriptions", subscriptionRouter);
// app.use("/api/invoices", invoiceRouter);
// app.use("/api/webhooks", webhookRouter);

// ── Global error handler — MUST be last ──────────────────────────────────────
app.use(errorHandler);