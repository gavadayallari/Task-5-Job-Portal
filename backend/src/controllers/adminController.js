const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');
const Report = require('../models/Report');
const Category = require('../models/Category');

// @desc    Get comprehensive Admin dashboard statistics & platform metrics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobSeekers = await User.countDocuments({
      role: { $in: ['jobseeker', 'candidate'] },
    });
    const totalEmployers = await User.countDocuments({
      role: { $in: ['employer', 'recruiter'] },
    });
    const totalActiveJobs = await Job.countDocuments({
      status: { $in: ['Active', 'active'] },
      approvalStatus: { $in: ['Approved', 'approved'] },
    });
    const totalApplications = await Application.countDocuments();
    const pendingJobApprovals = await Job.countDocuments({
      approvalStatus: 'Pending',
    });
    const totalCompanies = await Company.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'Pending' });

    // Recent 5 Applications
    const recentApplications = await Application.find()
      .populate('job', 'title companyName')
      .populate('applicant', 'name email avatar')
      .populate('candidate', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 Job Postings
    const recentJobs = await Job.find()
      .populate('employer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Platform Analytics Data:
    // 1. Jobs by top categories
    const jobsByCategory = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // 2. Applications by status
    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 3. Jobs by work mode
    const jobsByWorkMode = await Job.aggregate([
      { $group: { _id: '$workMode', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalJobSeekers,
        totalEmployers,
        totalActiveJobs,
        totalApplications,
        pendingJobApprovals,
        totalCompanies,
        pendingReports,
      },
      analytics: {
        jobsByCategory,
        applicationsByStatus,
        jobsByWorkMode,
      },
      recentApplications,
      recentJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search, role & pagination
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 15 } = req.query;

    const query = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }, { headline: regex }, { location: regex }];
    }

    if (role && role !== 'All') {
      if (role === 'jobseeker') {
        query.role = { $in: ['jobseeker', 'candidate'] };
      } else if (role === 'employer') {
        query.role = { $in: ['employer', 'recruiter'] };
      } else {
        query.role = role;
      }
    }

    if (status && status !== 'All') {
      query.isActive = status === 'active';
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .populate('company', 'name logo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user active/suspended status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Protect master admin from being deactivated
    if (user.email === 'admin@jobnova.com' && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'Master administrator account cannot be deactivated',
      });
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (role !== undefined && ['jobseeker', 'employer', 'admin'].includes(role)) {
      user.role = role;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `User status updated to ${user.isActive ? 'Active' : 'Suspended'}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.email === 'admin@jobnova.com') {
      return res.status(400).json({
        success: false,
        message: 'Master administrator cannot be deleted',
      });
    }

    // Clean up dependent resources
    await Job.deleteMany({ employer: user._id });
    await Application.deleteMany({ $or: [{ applicant: user._id }, { candidate: user._id }] });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User and associated data permanently removed',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs for administration (with approval status, search & filters)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
const getAllJobsAdmin = async (req, res, next) => {
  try {
    const { search, approvalStatus, status, category, page = 1, limit = 15 } = req.query;

    const query = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { companyName: regex }, { location: regex }, { category: regex }];
    }

    if (approvalStatus && approvalStatus !== 'All') {
      query.approvalStatus = approvalStatus;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('employer', 'name email avatar')
      .populate('company', 'name logo website')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject a job listing
// @route   PUT /api/admin/jobs/:id/approve
// @access  Private (Admin)
const approveJob = async (req, res, next) => {
  try {
    const { approvalStatus } = req.body; // 'Approved' or 'Rejected'

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found',
      });
    }

    job.approvalStatus = approvalStatus || 'Approved';
    if (job.approvalStatus === 'Approved') {
      job.status = 'Active';
    } else if (job.approvalStatus === 'Rejected') {
      job.status = 'Paused';
    }

    await job.save();

    res.status(200).json({
      success: true,
      message: `Job listing ${job.approvalStatus.toLowerCase()} successfully`,
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job listing by admin
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
const deleteJobAdmin = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found',
      });
    }

    await Application.deleteMany({ job: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Job listing deleted successfully by administrator',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reported jobs
// @route   GET /api/admin/reports
// @access  Private (Admin)
const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('job', 'title companyName location employer')
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status / take action
// @route   PUT /api/admin/reports/:id
// @access  Private (Admin)
const updateReport = async (req, res, next) => {
  try {
    const { status, actionTaken, deleteJobFlag } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    if (status) report.status = status;
    if (actionTaken) report.actionTaken = actionTaken;

    if (deleteJobFlag && report.job) {
      await Job.findByIdAndDelete(report.job);
      report.status = 'Action Taken';
      report.actionTaken = 'Job listing removed by administrator for policy violation.';
    }

    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      report,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllJobsAdmin,
  approveJob,
  deleteJobAdmin,
  getReports,
  updateReport,
};
