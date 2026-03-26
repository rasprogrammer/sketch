import express from "express";
import { auth } from "../middlewares/auth";
import { createRoom, getRooms, joinRoom, leaveRoom, verifyRoom } from "../controllers/room.controller";

const router = express.Router();

router.use(auth);

router.post("/create-room", createRoom);
router.post("/join-room", joinRoom);
router.post("/leave-or-delete", leaveRoom);
router.post("/verify", verifyRoom);
router.get("/rooms", getRooms);

export default router;