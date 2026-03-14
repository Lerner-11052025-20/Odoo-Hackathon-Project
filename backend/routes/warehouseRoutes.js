const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getWarehouses, getWarehouse, createWarehouse, updateWarehouse, deleteWarehouse,
  getLocations, createLocation, updateLocation, deleteLocation,
} = require('../controllers/warehouseController');

const router = express.Router();

// All routes require authentication
router.use(protect);

/* ── Warehouse Routes ── */
router.get('/',    getWarehouses);
router.get('/:id', getWarehouse);
router.post('/',   authorize('inventory_manager'), createWarehouse);
router.put('/:id', authorize('inventory_manager'), updateWarehouse);
router.delete('/:id', authorize('inventory_manager'), deleteWarehouse);

/* ── Location Routes (nested under warehouse) ── */
router.get('/:id/locations',    getLocations);
router.post('/:id/locations',   authorize('inventory_manager'), createLocation);

/* ── Location Update / Delete (flat) ── */
router.put('/locations/:locationId',    authorize('inventory_manager'), updateLocation);
router.delete('/locations/:locationId', authorize('inventory_manager'), deleteLocation);

module.exports = router;
