
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const config = Object.freeze({
  env: optionalEnv("NODE_ENV", "development"),
  port: parseInt(optionalEnv("PORT", "5000"), 10),
  mongoUri: requireEnv("MONGO_URI"),

  paymentGateway: optionalEnv("PAYMENT_GATEWAY", "mock") as "mock" | "stripe",

  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
 
  idempotencyTtlDays: parseInt(optionalEnv("IDEMPOTENCY_TTL_DAYS", "7"), 10),
});

export type AppConfig = typeof config;
