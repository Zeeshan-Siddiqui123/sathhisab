import { Router } from "express";
import * as usersController from "./users.controller.js";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import { updateProfileSchema, uploadAvatarSchema } from "./users.schema.js";

const router = Router();

router.patch("/me", requireAuth, validate({ body: updateProfileSchema }), usersController.updateMe);
router.post("/me/avatar", requireAuth, validate({ body: uploadAvatarSchema }), usersController.uploadAvatar);

export default router;
