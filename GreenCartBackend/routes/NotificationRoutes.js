const express = require("express");
const { createNotification, getNotifications, markAsRead, deleteNotification, markAllAsRead , deleteAllNotifications } = require("../controllers/NotificationController");
const router = express.Router();

// 📌 Route to create a notification
router.post("/", createNotification);

// 📌 Route to get all notifications
router.get("/", getNotifications);

// 📌 Route to mark a notification as read
router.put("/:id/read", markAsRead);
router.put("/mark-all-read", markAllAsRead);

// 📌 Route to delete a notification
router.delete("/clear-all", deleteAllNotifications);
router.delete("/:id", deleteNotification);

module.exports = router;
