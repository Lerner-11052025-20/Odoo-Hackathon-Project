const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, getActivity } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/activity', getActivity);

module.exports = router;
