const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema(
  {
    reference:     { type: String, required: true, unique: true },
    product:       { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity:      { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },

    // Source
    fromWarehouse: { type: String, required: true, trim: true },
    fromLocation:  { type: String, trim: true, default: '' },

    // Destination
    toWarehouse:   { type: String, required: true, trim: true },
    toLocation:    { type: String, trim: true, default: '' },

    status: {
      type: String,
      enum: ['Draft', 'Ready', 'In Progress', 'Done', 'Cancelled'],
      default: 'Draft',
    },

    scheduledDate: { type: Date, default: Date.now },
    notes:         { type: String, trim: true, default: '' },
    validatedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    validatedAt:   { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transfer', transferSchema);
