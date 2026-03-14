const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { generateOTP, sendOTP } = require('../utils/sendOTP');

// ─────────────────────────────────────────
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { loginId, email, password, confirmPassword, role } = req.body;

    // Validation
    if (!loginId || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (loginId.length < 6 || loginId.length > 12) {
      return res.status(400).json({ success: false, message: 'Login ID must be between 6-12 characters.' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 chars with uppercase, lowercase, and special character.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (!['inventory_manager', 'warehouse_staff'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role selected.' });
    }

    // Check duplicates
    const existingLoginId = await User.findOne({ loginId });
    if (existingLoginId) {
      return res.status(409).json({ success: false, message: 'Login ID is already taken. Please choose another.' });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: 'Email is already registered. Please login.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      loginId,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        loginId: user.loginId,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ success: false, message: 'Login ID and password are required.' });
    }

    // Find user
    const user = await User.findOne({ loginId });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid Login ID or Password.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Your account has been deactivated.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Login ID or Password.' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        loginId: user.loginId,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─────────────────────────────────────────
// @desc    Forgot password - send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
// ─────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email.' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRE_MINUTES || 5) * 60 * 1000);

    // Save OTP to user
    user.otp = { code: otp, expiresAt };
    await user.save();

    // Send OTP email
    await sendOTP(user.email, otp, user.loginId);

    res.status(200).json({
      success: true,
      message: `OTP sent to ${email}. Valid for 5 minutes.`,
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP. Try again.' });
  }
};

// ─────────────────────────────────────────
// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
// ─────────────────────────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (!user.otp || !user.otp.code) {
      return res.status(400).json({ success: false, message: 'No OTP requested. Please request a new one.' });
    }

    if (new Date() > user.otp.expiresAt) {
      user.otp = { code: null, expiresAt: null };
      await user.save();
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (user.otp.code !== otp.toString()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please check and try again.' });
    }

    // OTP verified — generate a short-lived reset token
    const resetToken = generateToken(user._id, user.role);

    // Clear OTP
    user.otp = { code: null, expiresAt: null };
    await user.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully!',
      resetToken,
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─────────────────────────────────────────
// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public (with reset token)
// ─────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 chars with uppercase, lowercase, and special character.',
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now log in.',
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ success: false, message: 'Reset failed. Token may be invalid or expired.' });
  }
};

// ─────────────────────────────────────────
// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Protected
// ─────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { register, login, forgotPassword, verifyOTP, resetPassword, getMe };
