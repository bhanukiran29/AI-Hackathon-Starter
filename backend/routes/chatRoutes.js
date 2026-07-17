import express from "express";
import { chatController, chatControllerStream } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", chatController);
router.post("/stream", chatControllerStream);

export default router;