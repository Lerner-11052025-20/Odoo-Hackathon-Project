const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['LOW_STOCK', 'NEW_PRODUCT', 'RECEIPT_CREATED', 'DELIVERY_CREATED', 'ADJUSTMENT_MADE', 'TRANSFER_COMPLETED', 'WAREHOUSE_CREATED', 'LOCATION_ADDED', 'SYSTEM'],
    required: true
  },
  userRole: {
    type: String,
    enum: ['inventory_manager', 'warehouse_staff', 'all'],
    default: 'all'
  },
  relatedModule: {
    type: String,
    enum: ['stock', 'receipts', 'deliveries', 'adjustments', 'transfers', 'warehouses', 'locations', 'system'],
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'onModel',
    default: null
  },
  onModel: {
    type: String,
    default: 'System'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
