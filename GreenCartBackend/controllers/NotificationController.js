const Notification = require("../models/NotificationModel");

// 📌 Create a new notification
const createNotification = async (req, res) => {
  try {
    const { message, type, actionBy } = req.body;

    const notification = new Notification({ message, type, actionBy });
    await notification.save();

    res.status(201).json({ success: true, message: "Notification created", notification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// 📌 Get all notifications for admin
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).populate("actionBy", "name email");
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// 📌 Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { status: "read" });
    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({}, { status: "read" });
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// 📌 Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
const deleteAllNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({status : "read"}); // Delete all notifications

    return res.status(200).json({ message: "All notifications deleted successfully" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteAllNotifications,
  markAllAsRead,
  deleteNotification,
};
