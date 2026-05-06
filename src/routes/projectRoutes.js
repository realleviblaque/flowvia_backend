const express = require('express');
const {
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', protect, createProject);
router.get('/:id', getProjectById);
router.put('/update', protect, updateProject);
router.delete('/delete', protect, deleteProject);

module.exports = router;