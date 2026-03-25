import express from "express";
import { me, signin, signup } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", me);

export default router;