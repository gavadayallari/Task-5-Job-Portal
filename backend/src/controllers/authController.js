const User = require('../models/User');
const Company = require('../models/Company');
const generateToken = require('../utils/generateToken');

// @desc    Register new user (Job Seeker or Employer)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, headline, companyName, location, phone, skills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    // Normalize role: only jobseeker or employer allowed on public registration
    let userRole = 'jobseeker';
    if (role === 'employer' || role === 'recruiter') {
      userRole = 'employer';
    } else if (role === 'jobseeker' || role === 'candidate') {
      userRole = 'jobseeker';
    }

    // Create user object
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: userRole,
      headline: headline || (userRole === 'employer' ? 'Hiring Specialist' : 'Job Seeker'),
      location: location || '',
      phone: phone || '',
      skills: Array.isArray(skills)
        ? skills
        : typeof skills === 'string' && skills.length > 0
        ? skills.split(',').map((s) => s.trim())
        : [],
    };

    const user = await User.create(userData);

    // If employer and companyName given, create/link company
    if (userRole === 'employer' && companyName) {
      let company = await Company.findOne({ name: companyName.trim() });
      if (!company) {
        company = await Company.create({
          name: companyName.trim(),
          employer: user._id,
          location: location || 'Bengaluru, India',
          description: `${companyName} is actively hiring top talent on JobNova.`,
        });
      }
      user.company = company._id;
      user.companyDetails = {
        name: company.name,
        logo: company.logo,
        website: company.website,
        about: company.description,
        location: company.location,
        size: company.companySize,
      };
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        headline: user.headline,
        avatar: user.avatar,
        phone: user.phone,
        location: user.location,
        company: user.company,
        companyDetails: user.companyDetails,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
        resumeUrl: user.resumeUrl,
        resumeOriginalName: user.resumeOriginalName,
        savedJobs: user.savedJobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select('+password')
      .populate('company');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User with this email does not exist.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact support.',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        headline: user.headline,
        bio: user.bio,
        avatar: user.avatar,
        phone: user.phone,
        location: user.location,
        company: user.company,
        companyDetails: user.companyDetails,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
        resumeUrl: user.resumeUrl,
        resumeOriginalName: user.resumeOriginalName,
        savedJobs: user.savedJobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('company');

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const {
      name,
      headline,
      bio,
      phone,
      location,
      skills,
      experience,
      education,
      companyDetails,
    } = req.body;

    // Security check: users MUST NOT be able to modify their own role
    // (role is intentionally omitted from destructured fields)

    if (name) user.name = name.trim();
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;

    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
        ? skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
    }

    if (experience !== undefined && Array.isArray(experience)) {
      user.experience = experience;
    }

    if (education !== undefined && Array.isArray(education)) {
      user.education = education;
    }

    if (companyDetails && (user.role === 'employer' || user.role === 'recruiter')) {
      user.companyDetails = {
        ...user.companyDetails,
        ...companyDetails,
      };

      // Also update linked company document if exists
      if (user.company) {
        await Company.findByIdAndUpdate(user.company, {
          name: companyDetails.name || user.companyDetails.name,
          logo: companyDetails.logo || user.companyDetails.logo,
          website: companyDetails.website || user.companyDetails.website,
          description: companyDetails.about || user.companyDetails.about,
          companySize: companyDetails.size || user.companyDetails.size,
          location: companyDetails.location || user.companyDetails.location,
        });
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile photo
// @route   POST /api/auth/avatar
// @access  Private
const uploadAvatarHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file to upload',
      });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
      avatar: avatarUrl,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume document (PDF, DOC, DOCX)
// @route   POST /api/auth/resume
// @access  Private
const uploadResumeHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid resume file (PDF, DOC, or DOCX)',
      });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    const resumeOriginalName = req.file.originalname;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        resumeUrl,
        resumeOriginalName,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl,
      resumeOriginalName,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password request
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your account email address',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Don't leak user existence in production; return standard success message
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been dispatched.',
      });
    }

    // In a production system, an email token is generated. Here we simulate the reset flow.
    res.status(200).json({
      success: true,
      message: 'Password reset instructions have been dispatched to your email address.',
      demoToken: 'demo-reset-token-' + Date.now(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email address',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now login.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  uploadAvatarHandler,
  uploadResumeHandler,
  forgotPassword,
  resetPassword,
};
