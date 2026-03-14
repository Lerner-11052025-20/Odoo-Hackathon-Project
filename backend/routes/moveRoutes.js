const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMoves } = require('../controllers/moveController');

const router = express.Router();

router.use(protect); // All authenticated roles can view history

router.get('/', getMoves);

module.exports = router;
