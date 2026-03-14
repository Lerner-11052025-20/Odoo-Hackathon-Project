const mongoose = require('mongoose');

const adjustmentSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  warehouse: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'Validated', 'Done', 'Cancelled'], default: 'Draft' },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    expectedQuantity: { type: Number, required: true },
    countedQuantity: { type: Number, required: true },
    difference: { type: Number, required: true },
    reason: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Adjustment', adjustmentSchema);
