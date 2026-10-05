import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Routes
import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import groupsRoutes from "./modules/groups/groups.routes.js";
import { publicInvitationsRouter } from "./modules/invitations/invitations.routes.js";
import expensesRoutes from "./modules/expenses/expenses.routes.js";
import balancesRoutes from "./modules/balances/balances.routes.js";
import settlementsRoutes from "./modules/settlements/settlements.routes.js";
import activityRoutes from "./modules/activity/activity.routes.js";

export const app = express();

// Middleware
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser(env.COOKIE_SECRET));
app.use(express.json());

// Request logging (console only per spec)
app.use((req, res, next) => {
  if (env.NODE_ENV !== "test") {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "ok",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/groups", groupsRoutes);
app.use("/api/v1/invitations", publicInvitationsRouter);

// Group sub-resources (nested under /api/v1/groups/:groupId)
app.use("/api/v1/groups/:groupId/expenses", expensesRoutes);
app.use("/api/v1/groups/:groupId/balances", balancesRoutes);
app.use("/api/v1/groups/:groupId/settlements", settlementsRoutes);
app.use("/api/v1/groups/:groupId/activity", activityRoutes);

// Central error handler
app.use(errorHandler);
