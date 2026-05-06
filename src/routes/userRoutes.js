const express = require("express");
const {
  getUserById,
  updateUserProfile,
  followUser
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

console.log("userRoutes loaded");

router.get("/test-route", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User routes working"
  });
});

router.put("/update", protect, updateUserProfile);
router.post("/follow", protect, followUser);
router.get("/:id", getUserById);

module.exports = router;