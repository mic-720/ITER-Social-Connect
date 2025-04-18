// --- Imports ---
const express = require("express");

// --- Router Configs ---
const router = express.Router();

const {
  createEvent,
  getEvent,
  markNotificationAsRead,
  getEvents,
} = require("../controllers/eventControllers.js"); // Updated path for consistency
const { isLoggedIn } = require("../middlewares/authMiddlewares");

router.post("/create", isLoggedIn, createEvent);
router.get("/", getEvents);
router.post("/mark-as-read", markNotificationAsRead);

module.exports = router;
