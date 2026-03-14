const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    loginId: {
      type: String,
      required: [true, 'Login ID is required'],
      unique: true,
      minlength: [6, 'Login ID must be at least 6 characters'],
      maxlength: [12, 'Login ID cannot exceed 12 characters'],
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      default: 'New User'
    },
    avatar: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    role: {
      type: String,
      enum: ['inventory_manager', 'warehouse_staff'],
      required: [true, 'Role is required'],
      default: 'warehouse_staff',
    },
    otp: {
      code: { type: String, default: null },
      expiresAt: { type: Date, default: null },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
