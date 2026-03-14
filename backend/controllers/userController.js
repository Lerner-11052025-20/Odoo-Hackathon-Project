const User = require('../models/User');
const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');
const Adjustment = require('../models/Adjustment');
const bcrypt = require('bcryptjs');

// ─────────────────────────────────────────
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Protected
// ─────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Protected
// ─────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check email format
    if (email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email structure' });
      }
      // Check if email taken by another user
      if (email.toLowerCase() !== user.email) {
        const existingEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
          return res.status(409).json({ success: false, message: 'Email is already in use' });
        }
        user.email = email.toLowerCase();
      }
    }

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    const updatedUser = await user.save();
    
    // Return user without password
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    delete userResponse.otp;

    res.status(200).json({ success: true, message: 'Profile updated successfully', data: userResponse });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Protected
// ─────────────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 chars with uppercase, lowercase, and special character.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }
    
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @desc    Get user activity wrapper
// @route   GET /api/users/activity
// @access  Protected
// ─────────────────────────────────────────
const getActivity = async (req, res, next) => {
  try {
    // In a fully granular system we'd query by createdBy = user._id
    // But since documents are general in this system context, we'll return
    // the global counts or derive from recent logs if accessible. 
    // We'll return system-wide totals.
    const receiptsCount = await Receipt.countDocuments();
    const deliveriesCount = await Delivery.countDocuments();
    const adjustmentsCount = await Adjustment.countDocuments();
    
    // Check specific user last login
    const user = await User.findById(req.user._id).select('lastLogin');
    
    const activityData = {
      receipts: receiptsCount,
      deliveries: deliveriesCount,
      adjustments: adjustmentsCount,
      lastLogin: user.lastLogin || new Date()
    };

    res.status(200).json({ success: true, data: activityData });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getActivity
};
