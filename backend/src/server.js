import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import app from "./app.js";

async function start() {
  await connectDB();
  const server = app.listen(env.port, () => console.log(`API running on http://localhost:${env.port}/api`));

  const shutdown = async (signal) => {
    console.log(`${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});
