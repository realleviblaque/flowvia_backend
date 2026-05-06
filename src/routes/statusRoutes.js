const express = require('express');
const {
    getWorkStatus,
    getHiringStatus
} = require('../controllers/statusController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/work', protect, getWorkStatus);
router.get('/hiring', protect, getHiringStatus);

module.exports = router;