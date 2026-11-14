const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyPostedJobs,
  reportJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getJobs);

// Protected routes
router.get('/my/posted', protect, authorize('employer', 'recruiter', 'admin'), getMyPostedJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('employer', 'recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('employer', 'recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('employer', 'recruiter', 'admin'), deleteJob);
router.post('/:id/report', protect, reportJob);

module.exports = router;
