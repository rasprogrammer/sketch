import express from "express";

const router = express.Router();

router.post("/create-room", (req, res) => {});
router.post("/join-room", (req, res) => {});
router.post("/leave-or-delete", (req, res) => {});
router.post("/verify", (req, res) => {});
router.get("/rooms", (req, res) => {});

export default router;