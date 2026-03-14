const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

// Apply protection to all analytics routes
router.use(protect);

router.get('/dashboard', analyticsController.getDashboardAnalytics);
router.get('/stock', analyticsController.getStockAnalytics);
router.get('/operations', analyticsController.getOperationsAnalytics);
router.get('/warehouse', analyticsController.getWarehouseAnalytics);
router.get('/movement', analyticsController.getMovementAnalytics);

module.exports = router;
