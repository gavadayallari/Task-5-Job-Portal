const SavedJob = require('../models/SavedJob');
const User = require('../models/User');
const Job = require('../models/Job');

// @desc    Toggle save/bookmark a job
// @route   POST /api/saved-jobs/:jobId
// @access  Private
const toggleSaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found',
      });
    }

    const existing = await SavedJob.findOne({ user: req.user._id, job: jobId });

    if (existing) {
      // Remove
      await SavedJob.findByIdAndDelete(existing._id);
      await User.findByIdAndUpdate(req.user._id, { $pull: { savedJobs: jobId } });
      return res.status(200).json({
        success: true,
        message: 'Job removed from saved bookmarks',
        isSaved: false,
      });
    } else {
      // Add
      await SavedJob.create({ user: req.user._id, job: jobId });
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedJobs: jobId } });
      return res.status(201).json({
        success: true,
        message: 'Job saved to bookmarks',
        isSaved: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved jobs for current user
// @route   GET /api/saved-jobs
// @access  Private
const getMySavedJobs = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ user: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo website industry' },
      })
      .sort({ createdAt: -1 });

    const jobs = saved.map((s) => s.job).filter(Boolean);

    res.status(200).json({
      success: true,
      count: jobs.length,
      savedJobs: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove saved job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private
const removeSavedJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    await SavedJob.findOneAndDelete({ user: req.user._id, job: jobId });
    await User.findByIdAndUpdate(req.user._id, { $pull: { savedJobs: jobId } });

    res.status(200).json({
      success: true,
      message: 'Job removed from saved bookmarks',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleSaveJob,
  getMySavedJobs,
  removeSavedJob,
};

