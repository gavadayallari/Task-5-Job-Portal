const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  uploadAvatarHandler,
  uploadResumeHandler,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadResume, uploadAvatar } = require('../middleware/upload');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, uploadAvatar.single('avatar'), uploadAvatarHandler);
router.post('/resume', protect, uploadResume.single('resume'), uploadResumeHandler);

module.exports = router;
