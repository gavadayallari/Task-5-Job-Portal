const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes: require valid JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'jobnova_fallback_secret_key_2026'
      );

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.',
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authorization token',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No bearer token provided in header',
    });
  }
};

// Optional protect middleware: if token present, sets req.user, otherwise continues
const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'jobnova_fallback_secret_key_2026'
      );
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    } catch {
      // silently ignore for optional routes
    }
  }
  next();
};

// Role-based authorization supporting jobseeker/candidate & employer/recruiter
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const userRole = req.user.role;
    // Normalize aliases
    const normalizedUserRole =
      userRole === 'candidate' ? 'jobseeker' :
      userRole === 'recruiter' ? 'employer' : userRole;

    const normalizedAllowedRoles = roles.map((r) =>
      r === 'candidate' ? 'jobseeker' :
      r === 'recruiter' ? 'employer' : r
    );

    if (
      !normalizedAllowedRoles.includes(normalizedUserRole) &&
      userRole !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: `Role '${userRole}' is not permitted to access this resource`,
      });
    }
    next();
  };
};

module.exports = { protect, optionalProtect, authorize };
