import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  Bookmark,
  Building2,
  Clock,
  Sparkles,
  ArrowUpRight,
  IndianRupee,
  Users,
} from 'lucide-react';
import Badge from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

const JobCard = ({ job, isBookmarked = false, onBookmarkToggle, onApplyClick }) => {
  const { user, toggleBookmark } = useAuth();
  const [bookmarked, setBookmarked] = useState(
    isBookmarked || user?.savedJobs?.some((id) => (id._id || id) === job._id)
  );
  const [bookmarking, setBookmarking] = useState(false);

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in as a job seeker to bookmark jobs');
      return;
    }
    try {
      setBookmarking(true);
      if (onBookmarkToggle) {
        await onBookmarkToggle(job._id);
        setBookmarked(!bookmarked);
      } else {
        const res = await toggleBookmark(job._id);
        setBookmarked(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBookmarking(false);
    }
  };

  // Format salary in INR (Lakhs or full format)
  const formatSalaryINR = (min, max) => {
    if (!min && !max) return '₹ Negotiable';
    const toLPA = (num) => {
      if (!num) return '';
      if (num >= 100000) {
        const lpa = num / 100000;
        return `${Number.isInteger(lpa) ? lpa : lpa.toFixed(1)}L`;
      }
      return `${(num / 1000).toFixed(0)}k`;
    };

    if (min && max) {
      return `₹${toLPA(min)} - ${toLPA(max)} PA`;
    }
    return `₹${toLPA(min || max)} PA`;
  };

  const companyLogo = job.companyLogo || job.company?.logo;
  const companyName = job.companyName || job.company?.name || 'Top Company';

  return (
    <div
      className={`group relative rounded-2xl bg-white dark:bg-slate-900 p-6 border transition-all duration-300 hover:shadow-card-hover ${
        job.isFeatured
          ? 'border-brand-300 dark:border-brand-700 ring-1 ring-brand-400/20 bg-gradient-to-br from-white dark:from-slate-900 via-white dark:via-slate-900 to-brand-50/30 dark:to-brand-950/20'
          : 'border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700'
      }`}
    >
      {/* Featured Ribbon */}
      {job.isFeatured && (
        <div className="absolute -top-3 left-6 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold text-white shadow-sm uppercase tracking-wider">
          <Sparkles className="w-3 h-3" /> Featured Role
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        {/* Company Avatar & Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={companyName}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-base">
                {companyName.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {companyName}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(job.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <Link
              to={`/jobs/${job._id}`}
              className="mt-1 block text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition"
            >
              {job.title}
            </Link>
          </div>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          disabled={bookmarking}
          aria-label="Save Job"
          className={`p-2.5 rounded-xl border transition-all ${
            bookmarked
              ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400'
              : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
          title={bookmarked ? 'Job Saved' : 'Save this job'}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Meta Pills (Location, Work Mode, Type, Experience) */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="primary" className="text-xs">
          <MapPin className="w-3 h-3" />
          {job.location}
        </Badge>
        <Badge variant="info" className="text-xs">
          {job.workMode || 'On-site'}
        </Badge>
        <Badge variant="default" className="text-xs">
          <Briefcase className="w-3 h-3" />
          {job.jobType || 'Full-time'}
        </Badge>
        {job.experienceRequired && (
          <Badge variant="purple" className="text-xs">
            {job.experienceRequired}
          </Badge>
        )}
      </div>

      {/* Skills Snippet */}
      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.requiredSkills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 4 && (
            <span className="text-[11px] text-slate-400 self-center">
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer Area: Salary & CTA */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Annual CTC
          </span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white flex items-center">
            {formatSalaryINR(job.minSalary, job.maxSalary)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {job.applicantsCount > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400">
              <Users className="w-3.5 h-3.5" />
              {job.applicantsCount} {job.applicantsCount === 1 ? 'applicant' : 'applicants'}
            </span>
          )}
          <Link
            to={`/jobs/${job._id}`}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-brand-600 dark:hover:bg-brand-400 dark:hover:text-white transition shadow-sm"
          >
            <span>View Job</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
