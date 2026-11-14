const Job = require('../models/Job');
const Company = require('../models/Company');
const Report = require('../models/Report');

// @desc    Get all jobs with advanced filtering, search, sorting & pagination
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      title,
      company,
      skills,
      category,
      location,
      workMode,
      jobType,
      experience,
      minSalary,
      maxSalary,
      sort,
      page = 1,
      limit = 10,
      featuredOnly,
    } = req.query;

    const query = {
      // By default only return active and approved jobs to the public
      status: { $in: ['Active', 'active'] },
      approvalStatus: { $in: ['Approved', 'approved'] },
    };

    // Keyword Search (across title, companyName, requiredSkills, description, location)
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { companyName: regex },
        { location: regex },
        { requiredSkills: { $in: [regex] } },
        { category: regex },
      ];
    }

    if (title && title.trim() !== '') {
      query.title = new RegExp(title.trim(), 'i');
    }

    if (company && company.trim() !== '') {
      query.companyName = new RegExp(company.trim(), 'i');
    }

    if (skills && skills.trim() !== '') {
      const skillsArray = skills.split(',').map((s) => new RegExp(s.trim(), 'i'));
      query.requiredSkills = { $in: skillsArray };
    }

    // Category filter
    if (category && category !== 'All' && category !== '') {
      query.category = category;
    }

    // Location filter
    if (location && location !== 'All' && location.trim() !== '') {
      query.location = new RegExp(location.trim(), 'i');
    }

    // Work Mode filter (Remote, Hybrid, On-site)
    if (workMode && workMode !== 'All' && workMode.trim() !== '') {
      query.workMode = workMode;
    }

    // Job Type filter (Full-time, Part-time, Internship, Contract)
    if (jobType && jobType !== 'All' && jobType.trim() !== '') {
      query.jobType = jobType;
    }

    // Experience filter
    if (experience && experience !== 'All' && experience.trim() !== '') {
      query.experienceRequired = new RegExp(experience.trim(), 'i');
    }

    // Salary range filter
    if (minSalary && !isNaN(Number(minSalary))) {
      query.maxSalary = { $gte: Number(minSalary) };
    }
    if (maxSalary && !isNaN(Number(maxSalary))) {
      query.minSalary = { ...(query.minSalary || {}), $lte: Number(maxSalary) };
    }

    // Featured filter
    if (featuredOnly === 'true') {
      query.isFeatured = true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'salary_desc') {
      sortOptions = { maxSalary: -1, minSalary: -1 };
    } else if (sort === 'salary_asc') {
      sortOptions = { minSalary: 1, maxSalary: 1 };
    } else if (sort === 'popular') {
      sortOptions = { viewsCount: -1, applicantsCount: -1 };
    } else if (sort === 'deadline') {
      sortOptions = { deadline: 1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logo website industry location isVerified')
      .populate('employer', 'name email avatar headline')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalJobs / limitNum);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total: totalJobs,
      totalPages,
      currentPage: pageNum,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('employer', 'name email avatar headline phone');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found',
      });
    }

    // Increment views count atomically
    job.viewsCount = (job.viewsCount || 0) + 1;
    await job.save();

    // Fetch related / similar jobs in the same category
    const similarJobs = await Job.find({
      category: job.category,
      _id: { $ne: job._id },
      status: { $in: ['Active', 'active'] },
    })
      .limit(4)
      .select('title companyName companyLogo location jobType minSalary maxSalary workMode createdAt');

    res.status(200).json({
      success: true,
      job,
      similarJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Employer & Admin)
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      companyName,
      companyLogo,
      category,
      description,
      requiredSkills,
      location,
      workMode,
      jobType,
      experienceRequired,
      minSalary,
      maxSalary,
      vacancies,
      educationQualification,
      deadline,
      responsibilities,
      requirements,
      benefits,
      status,
      isFeatured,
    } = req.body;

    if (!title || !category || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job title, category, location, and description',
      });
    }

    // Determine company
    let companyId = req.user.company;
    let finalCompanyName = companyName || req.user.companyDetails?.name || 'Company';
    let finalCompanyLogo = companyLogo || req.user.companyDetails?.logo || '';

    if (!companyId && finalCompanyName) {
      let comp = await Company.findOne({ name: finalCompanyName.trim() });
      if (!comp) {
        comp = await Company.create({
          name: finalCompanyName.trim(),
          logo: finalCompanyLogo,
          employer: req.user._id,
          location,
        });
      }
      companyId = comp._id;
    }

    // Skills array normalization
    let parsedSkills = [];
    if (Array.isArray(requiredSkills)) {
      parsedSkills = requiredSkills;
    } else if (typeof requiredSkills === 'string') {
      parsedSkills = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    // Responsibilities normalization
    let parsedResp = [];
    if (Array.isArray(responsibilities)) {
      parsedResp = responsibilities;
    } else if (typeof responsibilities === 'string') {
      parsedResp = responsibilities.split('\n').map((s) => s.trim()).filter(Boolean);
    }

    // Requirements normalization
    let parsedReqs = [];
    if (Array.isArray(requirements)) {
      parsedReqs = requirements;
    } else if (typeof requirements === 'string') {
      parsedReqs = requirements.split('\n').map((s) => s.trim()).filter(Boolean);
    }

    // Benefits normalization
    let parsedBenefits = [];
    if (Array.isArray(benefits)) {
      parsedBenefits = benefits;
    } else if (typeof benefits === 'string') {
      parsedBenefits = benefits.split('\n').map((s) => s.trim()).filter(Boolean);
    }

    const newJob = await Job.create({
      title: title.trim(),
      company: companyId,
      companyName: finalCompanyName,
      companyLogo: finalCompanyLogo,
      employer: req.user._id,
      category,
      description,
      requiredSkills: parsedSkills,
      location: location.trim(),
      workMode: workMode || 'On-site',
      jobType: jobType || 'Full-time',
      experienceRequired: experienceRequired || '1-3 years',
      minSalary: Number(minSalary) || 0,
      maxSalary: Number(maxSalary) || 0,
      vacancies: Number(vacancies) || 1,
      educationQualification: educationQualification || "Bachelor's Degree or equivalent",
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      responsibilities: parsedResp,
      requirements: parsedReqs,
      benefits: parsedBenefits,
      status: status || 'Active',
      approvalStatus: req.user.role === 'admin' ? 'Approved' : 'Approved', // Auto-approved for verified experience
      isFeatured: Boolean(isFeatured),
    });

    // Update company activeJobsCount
    if (companyId) {
      await Company.findByIdAndUpdate(companyId, { $inc: { activeJobsCount: 1 } });
    }

    res.status(201).json({
      success: true,
      message: 'Job posting published successfully',
      job: newJob,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Owner Employer or Admin)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found',
      });
    }

    // Verify ownership
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit jobs created by your account',
      });
    }

    const {
      title,
      companyName,
      companyLogo,
      category,
      description,
      requiredSkills,
      location,
      workMode,
      jobType,
      experienceRequired,
      minSalary,
      maxSalary,
      vacancies,
      educationQualification,
      deadline,
      responsibilities,
      requirements,
      benefits,
      status,
      isFeatured,
    } = req.body;

    if (title) job.title = title.trim();
    if (companyName) job.companyName = companyName.trim();
    if (companyLogo !== undefined) job.companyLogo = companyLogo;
    if (category) job.category = category;
    if (description) job.description = description;
    if (location) job.location = location.trim();
    if (workMode) job.workMode = workMode;
    if (jobType) job.jobType = jobType;
    if (experienceRequired) job.experienceRequired = experienceRequired;
    if (minSalary !== undefined) job.minSalary = Number(minSalary);
    if (maxSalary !== undefined) job.maxSalary = Number(maxSalary);
    if (vacancies !== undefined) job.vacancies = Number(vacancies);
    if (educationQualification) job.educationQualification = educationQualification;
    if (deadline) job.deadline = new Date(deadline);
    if (status) job.status = status;
    if (isFeatured !== undefined) job.isFeatured = Boolean(isFeatured);

    if (requiredSkills !== undefined) {
      job.requiredSkills = Array.isArray(requiredSkills)
        ? requiredSkills
        : requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (responsibilities !== undefined) {
      job.responsibilities = Array.isArray(responsibilities)
        ? responsibilities
        : responsibilities.split('\n').map((s) => s.trim()).filter(Boolean);
    }
    if (requirements !== undefined) {
      job.requirements = Array.isArray(requirements)
        ? requirements
        : requirements.split('\n').map((s) => s.trim()).filter(Boolean);
    }
    if (benefits !== undefined) {
      job.benefits = Array.isArray(benefits)
        ? benefits
        : benefits.split('\n').map((s) => s.trim()).filter(Boolean);
    }

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job listing updated successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Owner Employer or Admin)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found',
      });
    }

    // Verify ownership
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own job listings',
      });
    }

    if (job.company) {
      await Company.findByIdAndUpdate(job.company, { $inc: { activeJobsCount: -1 } });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job listing removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by current employer
// @route   GET /api/jobs/my/posted
// @access  Private (Employer)
const getMyPostedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('company', 'name logo');

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Report a job listing
// @route   POST /api/jobs/:id/report
// @access  Private
const reportJob = async (req, res, next) => {
  try {
    const { reason, details } = req.body;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found',
      });
    }

    const report = await Report.create({
      job: jobId,
      reporter: req.user._id,
      reason: reason || 'Spam or Scam',
      details: details || '',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your report. Our trust & safety team will review it promptly.',
      report,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyPostedJobs,
  reportJob,
};
