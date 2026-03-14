const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  warehouse: { type: String, required: true },
  scheduledDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Draft', 'Waiting', 'Ready', 'Done', 'Cancelled'], default: 'Draft' },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
