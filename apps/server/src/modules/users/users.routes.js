import { Router } from "express";
import * as usersController from "./users.controller.js";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import { updateProfileSchema } from "./users.schema.js";

const router = Router();

router.patch("/me", requireAuth, validate({ body: updateProfileSchema }), usersController.updateMe);

export default router;
