import "dotenv/config";
import { app } from "./app";
import { connectDB } from "./database/connect";
import { config } from "./config";

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`[INFO] FlexiPay server running on port ${config.port} (${config.env})`);
    });
  } catch (error) {
    console.error("[FATAL] Failed to start server:", error);
    process.exit(1);
  }
};

startServer();