import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { startCheckRunner } from "./modules/checks/check.runner.js";

const startServer = async () => {
  await connectDB(env.MONGO_URI);

  // Initialize the background monitoring service
  startCheckRunner();

  app.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

startServer();
