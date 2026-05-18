const express = require('express');
const {
  updateProfile,
  uploadPhoto,
  changePassword
} = require('../controllers/profileController');
const { protectRoute } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protectRoute);

router.put('/update', updateProfile);
router.put('/upload-photo', upload.single('photo'), uploadPhoto);
router.put('/change-password', changePassword);

module.exports = router;
