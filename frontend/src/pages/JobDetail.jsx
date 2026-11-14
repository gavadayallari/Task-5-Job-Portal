import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Building2,
  Clock,
  Calendar,
  Eye,
  Users,
  CheckCircle,
  Share2,
  Bookmark,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Check,
  AlertCircle,
  Flag,
  IndianRupee,
  Briefcase,
  GraduationCap,
  Layers,
} from 'lucide-react';
import Badge from '../components/common/Badge';
import ApplyModal from '../components/jobs/ApplyModal';
import ReportModal from '../components/jobs/ReportModal';
import JobCard from '../components/jobs/JobCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const { user, toggleBookmark, isJobSeeker } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.job);
          setSimilarJobs(res.data.similarJobs || []);
        }

        // Check if user has applied
        if (user) {
          try {
            const myAppsRes = await api.get('/applications/my');
            if (myAppsRes.data.success) {
              const matched = myAppsRes.data.applications?.find(
                (app) => (app.job?._id || app.job) === id
              );
              if (matched) {
                setHasApplied(true);
                setExistingApplication(matched);
              }
            }
          } catch {
            // ignore
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id, user]);

  useEffect(() => {
    if (user && job) {
      setBookmarked(user.savedJobs?.some((sId) => (sId._id || sId) === job._id));
    }
  }, [user, job]);

  const handleApplySuccess = (application) => {
    setHasApplied(true);
    setExistingApplication(application);
    if (job) {
      setJob({ ...job, applicantsCount: (job.applicantsCount || 0) + 1 });
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const res = await toggleBookmark(job._id);
    setBookmarked(res);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSalaryINR = (min, max) => {
    if (!min && !max) return '₹ Negotiable';
    const toLPA = (num) => {
      if (!num) return '';
      if (num >= 100000) {
        const lpa = num / 100000;
        return `${Number.isInteger(lpa) ? lpa : lpa.toFixed(1)} Lakhs`;
      }
      return `${num.toLocaleString()} INR`;
    };

    if (min && max) {
      return `₹${toLPA(min)} - ₹${toLPA(max)} PA`;
    }
    return `₹${toLPA(min || max)} PA`;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-3xl" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Job Listing Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{error || 'This job may have expired or was removed.'}</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Jobs
        </Link>
      </div>
    );
  }

  const companyLogo = job.companyLogo || job.company?.logo;
  const companyName = job.companyName || job.company?.name || 'Company';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors space-y-8">
      {/* Back Button */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Catalog</span>
        </Link>
      </div>

      {/* Main Header Hero Box */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        {job.isFeatured && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold text-white uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Featured Opening
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Company Logo & Job Title */}
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
              {companyLogo ? (
                <img src={companyLogo} alt={companyName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{companyName.charAt(0)}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                {job.company ? (
                  <Link
                    to={`/companies/${job.company._id || job.company}`}
                    className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <Building2 className="w-4 h-4" />
                    {companyName}
                  </Link>
                ) : (
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {companyName}
                  </span>
                )}
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge variant="primary">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </Badge>
                <Badge variant="info">{job.workMode || 'On-site'}</Badge>
                <Badge variant="default">
                  <Briefcase className="w-3 h-3" />
                  {job.jobType || 'Full-time'}
                </Badge>
                {job.category && (
                  <Badge variant="purple">
                    <Layers className="w-3 h-3" />
                    {job.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-3 pt-2 lg:pt-0 shrink-0">
            {hasApplied ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-bold shadow-sm">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>Application Submitted ({existingApplication?.status || 'Applied'})</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                  } else {
                    setIsApplyModalOpen(true);
                  }
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition text-center"
              >
                Apply for Position
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmarkToggle}
                className={`p-3 rounded-2xl border transition ${
                  bookmarked
                    ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                title={bookmarked ? 'Remove Bookmark' : 'Save this job'}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                title="Copy Job Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                title="Report Job Listing"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">Annual Compensation</span>
            <span className="font-extrabold text-slate-900 dark:text-white text-base">
              {formatSalaryINR(job.minSalary, job.maxSalary)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">Experience Level</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {job.experienceRequired || '1-3 years'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">Open Vacancies</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {job.vacancies || 1} {job.vacancies === 1 ? 'Opening' : 'Openings'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">Application Deadline</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling basis'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description, Responsibilities, Requirements */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Role Overview</h2>
            <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line space-y-3">
              {job.description}
            </div>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Key Responsibilities</h2>
              <ul className="space-y-2.5">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements & Qualifications */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Candidate Requirements & Qualifications</h2>
              <ul className="space-y-2.5">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>

              {job.educationQualification && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <GraduationCap className="w-4 h-4 text-brand-500" />
                  <span><strong>Education:</strong> {job.educationQualification}</span>
                </div>
              )}
            </div>
          )}

          {/* Benefits & Perks */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Benefits & Perks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.benefits.map((ben, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{ben}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Skills, Company Card, Meta */}
        <div className="space-y-6">
          {/* Required Skills Card */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Required Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Company Profile Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              About the Company
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center shrink-0">
                {companyLogo ? (
                  <img src={companyLogo} alt={companyName} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="font-bold text-base text-brand-600">{companyName.charAt(0)}</span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{companyName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{job.company?.industry || 'Information Technology'}</p>
              </div>
            </div>

            {job.company?.description && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {job.company.description}
              </p>
            )}

            <div className="pt-2">
              {job.company && (
                <Link
                  to={`/companies/${job.company._id || job.company}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition"
                >
                  <span>View Company Profile & All Jobs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Job Meta Stats */}
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 p-6 border border-slate-200 dark:border-slate-800 space-y-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-slate-400" /> Total Views</span>
              <span className="font-bold text-slate-900 dark:text-white">{job.viewsCount || 1}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> Total Applicants</span>
              <span className="font-bold text-slate-900 dark:text-white">{job.applicantsCount || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Job Status</span>
              <Badge variant="active">Active & Hiring</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Jobs Section */}
      {similarJobs && similarJobs.length > 0 && (
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Similar {job.category} Openings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Explore related roles currently accepting applications
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarJobs.slice(0, 3).map((sJob) => (
              <JobCard key={sJob._id} job={sJob} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
        onApplySuccess={handleApplySuccess}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        jobId={job._id}
        jobTitle={job.title}
      />
    </div>
  );
};

export default JobDetail;
