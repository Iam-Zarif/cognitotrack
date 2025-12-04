import { Router } from "express";

import { registerHandler } from "../api/register/route";
import { loginHandler } from "../api/login/route";
import { checkUsernameHandler } from "../api/username-check/route";


const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/username-check", checkUsernameHandler);

export default router;
