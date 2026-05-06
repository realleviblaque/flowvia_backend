const express = require('express');
const {
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    searchProjects,
    getAllProjects,
    getMyProjects,
    getOpenProjects
} = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post("/create", protect, createProject);
router.put("/update", protect, updateProject);
router.delete("/delete", protect, deleteProject);

router.get("/", getAllProjects);
router.get("/search", searchProjects);
router.get("/my-projects", protect, getMyProjects);
router.get("/open", getOpenProjects);

router.get("/:id", getProjectById);

module.exports = router;