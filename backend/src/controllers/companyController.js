const Company = require('../models/Company');
const Job = require('../models/Job');

// @desc    Get all companies with search & filters
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res, next) => {
  try {
    const { search, industry, location, page = 1, limit = 12 } = req.query;

    const query = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { industry: regex }, { location: regex }, { description: regex }];
    }

    if (industry && industry !== 'All') {
      query.industry = new RegExp(industry.trim(), 'i');
    }

    if (location && location !== 'All') {
      query.location = new RegExp(location.trim(), 'i');
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Compute active jobs dynamically for accurate counts
    const populated = await Promise.all(
      companies.map(async (comp) => {
        const count = await Job.countDocuments({
          company: comp._id,
          status: { $in: ['Active', 'active'] },
        });
        const obj = comp.toObject();
        obj.activeJobsCount = count;
        return obj;
      })
    );

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      companies: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company details by ID with posted active jobs
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate('employer', 'name email avatar headline');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    // Get all active jobs posted by this company
    const jobs = await Job.find({
      $or: [{ company: company._id }, { companyName: company.name }],
      status: { $in: ['Active', 'active'] },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      company,
      jobs,
      activeJobsCount: jobs.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company profile for the logged in employer
// @route   GET /api/companies/my
// @access  Private (Employer)
const getMyCompany = async (req, res, next) => {
  try {
    let company = null;
    if (req.user.company) {
      company = await Company.findById(req.user.company);
    } else {
      company = await Company.findOne({ employer: req.user._id });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new company profile
// @route   POST /api/companies
// @access  Private (Employer / Admin)
const createCompany = async (req, res, next) => {
  try {
    const { name, logo, website, industry, companySize, foundedYear, location, description, socialLinks } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide company name',
      });
    }

    const existing = await Company.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A company with this name is already registered',
      });
    }

    const company = await Company.create({
      name: name.trim(),
      employer: req.user._id,
      logo: logo || '',
      website: website || '',
      industry: industry || 'Information Technology',
      companySize: companySize || '50-200 employees',
      foundedYear: foundedYear || 2018,
      location: location || 'Bengaluru, India',
      description: description || '',
      socialLinks: socialLinks || {},
    });

    // Link company to user profile
    req.user.company = company._id;
    req.user.companyDetails = {
      name: company.name,
      logo: company.logo,
      website: company.website,
      about: company.description,
      size: company.companySize,
      location: company.location,
    };
    await req.user.save();

    res.status(201).json({
      success: true,
      message: 'Company profile created successfully',
      company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company profile
// @route   PUT /api/companies/:id
// @access  Private (Employer / Admin)
const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    // Authorization
    if (company.employer && company.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own company profile',
      });
    }

    const { name, logo, website, industry, companySize, foundedYear, location, description, socialLinks } = req.body;

    if (name) company.name = name.trim();
    if (logo !== undefined) company.logo = logo;
    if (website !== undefined) company.website = website;
    if (industry) company.industry = industry;
    if (companySize) company.companySize = companySize;
    if (foundedYear) company.foundedYear = foundedYear;
    if (location) company.location = location;
    if (description !== undefined) company.description = description;
    if (socialLinks) company.socialLinks = { ...company.socialLinks, ...socialLinks };

    await company.save();

    // Also sync with user companyDetails
    if (req.user.company && req.user.company.toString() === company._id.toString()) {
      req.user.companyDetails = {
        name: company.name,
        logo: company.logo,
        website: company.website,
        about: company.description,
        size: company.companySize,
        location: company.location,
      };
      await req.user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Company profile updated successfully',
      company,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  getMyCompany,
  createCompany,
  updateCompany,
};

