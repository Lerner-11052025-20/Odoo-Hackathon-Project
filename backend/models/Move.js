const mongoose = require('mongoose');

const moveSchema = new mongoose.Schema({
  reference: { type: String, required: true },
  operationId: { type: mongoose.Schema.Types.ObjectId, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  movementType: { type: String, enum: ['RECEIPT', 'DELIVERY', 'ADJUSTMENT', 'TRANSFER'], required: true },
  fromLocation: { type: String, default: '' },
  toLocation: { type: String, default: '' },
  warehouse: { type: String, default: '' },
  status: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Move', moveSchema);
