// backend/routes/messageRoute.js
import express from "express";
import { getMessage, sendMessage, markConversationAsRead } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/:id").get(isAuthenticated, getMessage); // For fetching messages for a conversation
router.route("/read/:otherUserId").put(isAuthenticated, markConversationAsRead); // For explicitly marking read

export default router;