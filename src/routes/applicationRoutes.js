const express = require("express");
const {
  applyToProject,
  acceptApplication,
  rejectApplication,
  getMyApplications,
  getProjectApplications
} = require("../controllers/applicationController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

console.log("protect:", typeof protect);
console.log("applyToProject:", typeof applyToProject);
console.log("acceptApplication:", typeof acceptApplication);
console.log("rejectApplication:", typeof rejectApplication);
console.log("getMyApplications:", typeof getMyApplications);
console.log("getProjectApplications:", typeof getProjectApplications);

router.post("/apply", protect, applyToProject);
router.post("/accept", protect, acceptApplication);
router.post("/reject", protect, rejectApplication);
router.get("/my-applications", protect, getMyApplications);
router.get("/project/:projectId", protect, getProjectApplications);

module.exports = router;