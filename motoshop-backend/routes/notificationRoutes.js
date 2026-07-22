const express = require("express")
const router = express.Router()
const {
    getUserNotifications,
    getAdminNotifications,
} = require("../controllers/notificationController")
const { verifyUser } = require("../middleware/authMiddleware")
const { verifyAdmin } = require("../middleware/authMiddleware")
router.get("/user", verifyUser, getUserNotifications)
router.get("/admin", verifyAdmin, getAdminNotifications)

module.exports = router