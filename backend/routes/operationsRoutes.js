const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const operationsController = require('../controllers/operationsController');

const router = express.Router();

// Apply auth middleware to all operations routes
router.use(protect);

// --- RECEIPTS ---
router.route('/receipts')
  .get(operationsController.getReceipts)
  .post(authorize('inventory_manager'), operationsController.createReceipt);

router.route('/receipts/:id')
  .get(operationsController.getReceiptById)
  .put(authorize('inventory_manager'), operationsController.updateReceipt)
  .delete(authorize('inventory_manager'), operationsController.deleteReceipt);

router.post('/receipts/validate/:id', authorize('inventory_manager'), operationsController.validateReceipt);

// --- DELIVERIES ---
router.route('/deliveries')
  .get(operationsController.getDeliveries)
  .post(authorize('inventory_manager'), operationsController.createDelivery);

router.route('/deliveries/:id')
  .get(operationsController.getDeliveryById)
  .put(authorize('inventory_manager'), operationsController.updateDelivery);
  // Optional delete

router.post('/deliveries/validate/:id', authorize('inventory_manager'), operationsController.validateDelivery);

// --- ADJUSTMENTS ---
router.route('/adjustments')
  .get(operationsController.getAdjustments)
  .post(authorize('inventory_manager'), operationsController.createAdjustment);

router.route('/adjustments/:id')
  .put(authorize('inventory_manager'), operationsController.updateAdjustment);

router.post('/adjustments/validate/:id', authorize('inventory_manager'), operationsController.validateAdjustment);

module.exports = router;
