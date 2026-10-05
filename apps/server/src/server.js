import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(`🚀 SaathHisab Server running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server stopped");
    process.exit(0);
  });
});
