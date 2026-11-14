import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Job<span className="text-brand-400">Nova</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              India's premier modern career portal inspired by Naukri, Indeed, and LinkedIn Jobs. 
              Connecting ambitious talent with high-growth technology companies and verified employers.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-brand-600 hover:text-white flex items-center justify-center text-slate-400 transition">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-brand-600 hover:text-white flex items-center justify-center text-slate-400 transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-brand-600 hover:text-white flex items-center justify-center text-slate-400 transition">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              For Job Seekers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-white transition">Browse All Jobs</Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-white transition">Top Companies</Link>
              </li>
              <li>
                <Link to="/dashboard/seeker" className="hover:text-white transition">Seeker Dashboard</Link>
              </li>
              <li>
                <Link to="/my-applications" className="hover:text-white transition">My Applications</Link>
              </li>
              <li>
                <Link to="/saved-jobs" className="hover:text-white transition">Saved Jobs</Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/post-job" className="hover:text-white transition">Post a Job</Link>
              </li>
              <li>
                <Link to="/dashboard/employer" className="hover:text-white transition">Employer Dashboard</Link>
              </li>
              <li>
                <Link to="/employer/manage-jobs" className="hover:text-white transition">Manage Listings</Link>
              </li>
              <li>
                <Link to="/employer/applicants" className="hover:text-white transition">Review Applicants</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">Employer Register</Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition">About JobNova</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact Us & FAQ</Link>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5" /> Bengaluru, Mumbai, Pune
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Mail className="w-3.5 h-3.5" /> support@jobnova.com
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone className="w-3.5 h-3.5" /> +91 (80) 4123-5678
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} JobNova Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/about" className="hover:text-white transition">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white transition">Security & Trust</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
