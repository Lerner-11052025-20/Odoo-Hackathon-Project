const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    code:        { type: String, required: true, trim: true, uppercase: true },
    warehouse:   { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    description: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

// Ensure location code is unique within a warehouse
locationSchema.index({ warehouse: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Location', locationSchema);
