import { app } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./lib/db.js";

const server = app.listen(env.PORT, () => {
  console.log(`🚀 SaathHisab Server running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

function shutdown() {
  server.close(async () => {
    await pool.end();
    console.log("Server stopped");
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
