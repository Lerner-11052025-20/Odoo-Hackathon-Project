const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getLocations, getLocation, createLocation, updateLocation, deleteLocation,
} = require('../controllers/locationController');

const router = express.Router();

router.use(protect);

router.get('/',    getLocations);
router.get('/:id', getLocation);
router.post('/',    authorize('inventory_manager'), createLocation);
router.put('/:id',  authorize('inventory_manager'), updateLocation);
router.delete('/:id', authorize('inventory_manager'), deleteLocation);

module.exports = router;
