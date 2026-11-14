import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Users,
  Calendar,
  Globe,
  ShieldCheck,
  Briefcase,
  ArrowLeft,
  ExternalLink,
  Linkedin,
  Twitter,
  Github,
} from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CompanyDetail = () => {
  const { id } = useParams();
  const { toggleBookmark } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/companies/${id}`);
        if (res.data.success) {
          setCompany(res.data.company);
          setJobs(res.data.jobs || []);
        }
      } catch (err) {
        setError(err.message || 'Company not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
        <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Company Profile Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This company may not exist or has been unlisted.'}</p>
        <Link
          to="/companies"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Companies Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors space-y-8">
      {/* Back Link */}
      <div>
        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Companies Directory</span>
        </Link>
      </div>

      {/* Hero Banner Header */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">{company.name.charAt(0)}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {company.name}
                </h1>
                {company.isVerified && (
                  <ShieldCheck className="w-6 h-6 text-brand-500 shrink-0" title="Verified Employer" />
                )}
              </div>

              <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">{company.industry}</p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {company.location}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {company.companySize || '500+ employees'}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Founded {company.foundedYear || 2010}
                </span>
              </div>
            </div>
          </div>

          {/* Website Link */}
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 text-xs font-bold transition shadow-sm shrink-0"
            >
              <Globe className="w-4 h-4" />
              <span>Visit Official Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          )}
        </div>

        {/* Company Bio */}
        {company.description && (
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About the Organization</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
              {company.description}
            </p>
          </div>
        )}
      </div>

      {/* Jobs Listing for this company */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Open Positions at {company.name} ({jobs.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active openings hiring currently with rapid recruitment cycles
            </p>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No active job posts right now</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Check back later or explore other companies.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={{ ...job, company }}
                onBookmarkToggle={toggleBookmark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;

