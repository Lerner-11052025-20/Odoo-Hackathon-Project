const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

router.route('/')
  .get(protect, getProducts)
  .post(protect, authorize('inventory_manager'), createProduct);

router.route('/:id')
  .get(protect, getProduct)
  .put(protect, authorize('inventory_manager'), updateProduct)
  .delete(protect, authorize('inventory_manager'), deleteProduct);

module.exports = router;
