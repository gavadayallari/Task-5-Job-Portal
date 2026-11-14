const express = require('express');
const router = express.Router();
const {
  applyJob,
  getMyApplications,
  getJobApplicants,
  getAllEmployerApplications,
  updateApplicationStatus,
  withdrawApplication,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

// Job Seeker routes
router.post('/', protect, applyJob);
router.get('/my', protect, getMyApplications);
router.delete('/:id', protect, withdrawApplication);

// Employer & Admin routes
router.get('/job/:jobId', protect, authorize('employer', 'recruiter', 'admin'), getJobApplicants);
router.get('/employer/all', protect, authorize('employer', 'recruiter', 'admin'), getAllEmployerApplications);
router.put('/:id/status', protect, authorize('employer', 'recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
