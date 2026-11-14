const express = require('express');
const router = express.Router();
const {
  toggleSaveJob,
  getMySavedJobs,
  removeSavedJob,
} = require('../controllers/savedJobController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getMySavedJobs);
router.route('/:jobId').post(toggleSaveJob).delete(removeSavedJob);

module.exports = router;

