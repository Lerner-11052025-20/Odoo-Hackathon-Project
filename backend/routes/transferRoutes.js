const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getTransfers, getTransfer,
  createTransfer, updateTransfer, deleteTransfer,
  validateTransfer,
} = require('../controllers/transferController');

const router = express.Router();
router.use(protect);

router.get('/',     getTransfers);
router.get('/:id',  getTransfer);

router.post('/',    authorize('inventory_manager'), createTransfer);
router.put('/:id',  authorize('inventory_manager'), updateTransfer);
router.delete('/:id', authorize('inventory_manager'), deleteTransfer);

// Both roles can validate (staff executes, manager validates)
router.post('/validate/:id', validateTransfer);

module.exports = router;
