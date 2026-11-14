const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllJobsAdmin,
  approveJob,
  deleteJobAdmin,
  getReports,
  updateReport,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Protect all admin routes with JWT and Admin role check
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Job listings management & approvals
router.get('/jobs', getAllJobsAdmin);
router.put('/jobs/:id/approve', approveJob);
router.delete('/jobs/:id', deleteJobAdmin);

// Reports management
router.get('/reports', getReports);
router.put('/reports/:id', updateReport);

module.exports = router;
