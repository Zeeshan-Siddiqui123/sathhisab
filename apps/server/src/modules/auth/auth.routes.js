import { Router } from "express";
import * as authController from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import { signupSchema, loginSchema } from "./auth.schema.js";

const router = Router();

router.post("/signup", validate({ body: signupSchema }), authController.signup);
router.post("/login", validate({ body: loginSchema }), authController.login);
router.post("/logout", requireAuth, authController.logout);
router.get("/me", requireAuth, authController.me);

export default router;
