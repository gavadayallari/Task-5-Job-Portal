const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyById,
  getMyCompany,
  createCompany,
  updateCompany,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getCompanies);
router.get('/my', protect, authorize('employer', 'recruiter', 'admin'), getMyCompany);
router.get('/:id', getCompanyById);

// Protected routes
router.post('/', protect, authorize('employer', 'recruiter', 'admin'), createCompany);
router.put('/:id', protect, authorize('employer', 'recruiter', 'admin'), updateCompany);

module.exports = router;

