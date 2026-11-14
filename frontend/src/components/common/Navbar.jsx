import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Briefcase,
  User,
  PlusCircle,
  LayoutDashboard,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Bookmark,
  ShieldCheck,
  Building2,
  Bell,
  Sun,
  Moon,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Badge from './Badge';

const Navbar = () => {
  const { user, logout, login, unreadCount, isJobSeeker, isEmployer, isAdmin } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleDemoLogin = async (email, password) => {
    try {
      await login(email, password);
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Determine user's primary dashboard link
  const getDashboardPath = () => {
    if (isAdmin) return '/dashboard/admin';
    if (isEmployer) return '/dashboard/employer';
    return '/dashboard/seeker';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">
                    Job<span className="text-brand-500">Nova</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
                  Careers & Hiring Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-200 dark:border-slate-800">
              <Link
                to="/jobs"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/jobs')
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50/80 dark:bg-brand-950/50 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                Find Jobs
              </Link>

              <Link
                to="/companies"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/companies')
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50/80 dark:bg-brand-950/50 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                Top Companies
              </Link>

              <Link
                to="/about"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/about')
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50/80 dark:bg-brand-950/50 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                About
              </Link>

              <Link
                to="/contact"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/contact')
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50/80 dark:bg-brand-950/50 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {user ? (
              <>
                {/* Notification Bell */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Dashboard Shortcut Button */}
                <Link
                  to={getDashboardPath()}
                  className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-500" />
                  <span>Dashboard</span>
                </Link>

                {/* Employer: Post Job CTA */}
                {(isEmployer || isAdmin) && (
                  <Link
                    to="/post-job"
                    className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-sm shadow-brand-500/25 transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post a Job</span>
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="hidden md:inline-block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <Badge variant={isAdmin ? 'purple' : isEmployer ? 'warning' : 'primary'}>
                            {isAdmin ? 'Admin' : isEmployer ? 'Employer' : 'Job Seeker'}
                          </Badge>
                          {user.location && (
                            <span className="text-[11px] text-slate-400 truncate">{user.location}</span>
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-brand-500" />
                          <span>My Dashboard</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Profile</span>
                        </Link>

                        {isJobSeeker && (
                          <>
                            <Link
                              to="/my-applications"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                            >
                              <FileText className="w-4 h-4 text-emerald-500" />
                              <span>My Applications</span>
                            </Link>
                            <Link
                              to="/saved-jobs"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                            >
                              <Bookmark className="w-4 h-4 text-amber-500" />
                              <span>Saved Jobs</span>
                            </Link>
                          </>
                        )}

                        {(isEmployer || isAdmin) && (
                          <>
                            <Link
                              to="/post-job"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                            >
                              <PlusCircle className="w-4 h-4 text-brand-500" />
                              <span>Post New Job</span>
                            </Link>
                            <Link
                              to="/employer/manage-jobs"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                            >
                              <Briefcase className="w-4 h-4 text-indigo-500" />
                              <span>Manage Jobs</span>
                            </Link>
                            <Link
                              to="/employer/applicants"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                            >
                              <FileText className="w-4 h-4 text-cyan-500" />
                              <span>Manage Applicants</span>
                            </Link>
                          </>
                        )}

                        {isAdmin && (
                          <Link
                            to="/dashboard/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-purple-600 dark:text-purple-400 font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/40 transition"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Admin Portal</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white shadow-sm shadow-brand-500/25 transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
          <nav className="flex flex-col space-y-1">
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Find Jobs
            </Link>
            <Link
              to="/companies"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Top Companies
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              About JobNova
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Contact Support
            </Link>

            {user ? (
              <>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Dashboard</p>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-brand-600 dark:text-brand-400"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Go to Dashboard</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>

                  {isJobSeeker && (
                    <>
                      <Link
                        to="/my-applications"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        <FileText className="w-4 h-4" />
                        <span>My Applications</span>
                      </Link>
                      <Link
                        to="/saved-jobs"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        <Bookmark className="w-4 h-4" />
                        <span>Saved Jobs</span>
                      </Link>
                    </>
                  )}

                  {(isEmployer || isAdmin) && (
                    <>
                      <Link
                        to="/post-job"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Post New Job</span>
                      </Link>
                      <Link
                        to="/employer/manage-jobs"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        <Briefcase className="w-4 h-4" />
                        <span>Manage Posted Jobs</span>
                      </Link>
                      <Link
                        to="/employer/applicants"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Review Applicants</span>
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 mt-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 rounded-xl text-sm font-medium bg-brand-600 text-white"
                  >
                    Register
                  </Link>
                </div>

                {/* Quick Demo Login shortcuts for fast testing */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">⚡ 1-Click Demo Accounts</p>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <button
                      onClick={() => handleDemoLogin('rahul.sharma@example.com', 'seeker123')}
                      className="py-1 px-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-medium text-slate-700 dark:text-slate-200 hover:border-brand-500"
                    >
                      Seeker
                    </button>
                    <button
                      onClick={() => handleDemoLogin('hr.infosys@jobnova.com', 'employer123')}
                      className="py-1 px-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-medium text-slate-700 dark:text-slate-200 hover:border-brand-500"
                    >
                      Employer
                    </button>
                    <button
                      onClick={() => handleDemoLogin('admin@jobnova.com', 'admin123')}
                      className="py-1 px-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-medium text-slate-700 dark:text-slate-200 hover:border-brand-500"
                    >
                      Admin
                    </button>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
