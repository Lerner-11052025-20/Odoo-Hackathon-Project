const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getKPIs, getActivity, getRecentOperations } = require('../controllers/dashboardController');

const router = express.Router();

router.use(protect); // All dashboard routes require authentication

router.get('/kpis', getKPIs);
router.get('/activity', getActivity);
router.get('/recent-operations', getRecentOperations);

module.exports = router;
