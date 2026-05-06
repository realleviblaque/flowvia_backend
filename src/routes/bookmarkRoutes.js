const express = require("express");
const {
  toggleBookmark,
  getBookmarkedProjects
} = require("../controllers/bookmarkController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/toggle", protect, toggleBookmark);
router.get("/", protect, getBookmarkedProjects);

module.exports = router;