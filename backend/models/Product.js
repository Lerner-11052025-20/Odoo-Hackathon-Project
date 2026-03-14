const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  sku: {
    type: String,
    required: [true, 'Please add a SKU'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    trim: true,
  },
  unit: {
    type: String,
    required: [true, 'Please specify unit of measure'],
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  warehouse: {
    type: String,
    required: [true, 'Please specify a warehouse'],
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
