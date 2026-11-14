import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Trash2,
  Bookmark,
  CheckCircle2,
  XCircle,
  Video,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  User,
  ShieldCheck,
} from 'lucide-react';
import Badge from '../components/common/Badge';
import ConfirmationModal from '../components/common/ConfirmationModal';
import JobCard from '../components/jobs/JobCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CandidateDashboard = () => {
  const { user, refreshUser, toggleBookmark } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [targetAppId, setTargetAppId] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        const [appsRes, jobsRes] = await Promise.all([
          api.get('/applications/my'),
          api.get('/jobs?limit=4'),
        ]);

        if (appsRes.data.success) {
          setApplications(appsRes.data.applications || []);
        }
        if (jobsRes.data.success) {
          setRecommendedJobs(jobsRes.data.jobs || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const confirmWithdraw = async () => {
    if (!targetAppId) return;
    try {
      setWithdrawing(true);
      const res = await api.delete(`/applications/${targetAppId}`);
      if (res.data.success) {
        setApplications((prev) => prev.filter((app) => app._id !== targetAppId));
        setWithdrawModalOpen(false);
        setTargetAppId(null);
        refreshUser();
      }
    } catch (err) {
      alert(err.message || 'Failed to withdraw application');
    } finally {
      setWithdrawing(false);
    }
  };

  // Profile Completeness calculation
  const calculateCompleteness = () => {
    if (!user) return 0;
    let score = 0;
    if (user.avatar) score += 15;
    if (user.resumeUrl) score += 25;
    if (user.skills && user.skills.length > 0) score += 20;
    if (user.experience && user.experience.length > 0) score += 20;
    if (user.education && user.education.length > 0) score += 20;
    return score;
  };

  const completeness = calculateCompleteness();

  // Metrics
  const appliedCount = applications.length;
  const underReviewCount = applications.filter((a) => a.status === 'Under Review' || a.status === 'under-review').length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted' || a.status === 'shortlisted').length;
  const interviewsCount = applications.filter((a) => a.status === 'Interview Scheduled' || a.status === 'interview').length;
  const savedCount = user?.savedJobs?.length || 0;

  // Find upcoming scheduled interview
  const upcomingInterview = applications.find(
    (a) => a.status === 'Interview Scheduled' && a.interviewDetails?.scheduledDate
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-brand-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl font-bold overflow-hidden shadow-inner shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-brand-100 font-medium max-w-xl">
              {user?.headline || 'Job Seeker'} • {user?.location || 'India'}
            </p>
          </div>
        </div>

        {/* Profile Completeness Pill */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shrink-0 w-full md:w-64 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span>Profile Completeness</span>
            <span>{completeness}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
          <Link
            to="/profile"
            className="text-[11px] font-bold text-white hover:text-brand-200 underline block text-right"
          >
            {completeness < 100 ? 'Complete Profile →' : 'Edit Profile →'}
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submitted</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{appliedCount}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Total applications</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Under Review</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">{underReviewCount}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">In HR screening</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">Shortlisted</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{shortlistedCount}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Passed round 1</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider block">Interviews</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">{interviewsCount}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Scheduled rounds</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Saved Roles</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{savedCount}</p>
          <Link to="/saved-jobs" className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline block">
            View Bookmarks →
          </Link>
        </div>
      </div>

      {/* Upcoming Interview Card (if scheduled) */}
      {upcomingInterview && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-purple-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/40 text-purple-200 uppercase tracking-wider">
                Upcoming Live Interview
              </span>
              <h3 className="text-lg font-bold">
                {upcomingInterview.job?.title} @ {upcomingInterview.job?.companyName}
              </h3>
              <p className="text-xs text-purple-200">
                {new Date(upcomingInterview.interviewDetails.scheduledDate).toLocaleDateString()} at{' '}
                <strong>{upcomingInterview.interviewDetails.time}</strong> via{' '}
                {upcomingInterview.interviewDetails.mode}
              </p>
              {upcomingInterview.interviewDetails.notes && (
                <p className="text-xs text-purple-300/90 pt-1">
                  <strong>Recruiter Note:</strong> {upcomingInterview.interviewDetails.notes}
                </p>
              )}
            </div>
          </div>

          {upcomingInterview.interviewDetails.meetingLink && (
            <a
              href={upcomingInterview.interviewDetails.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-purple-950 font-bold text-xs shadow-md hover:bg-purple-50 transition shrink-0"
            >
              <Video className="w-4 h-4 text-purple-600" />
              <span>Join Meeting</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Recent Applications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Recent Applications ({applications.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Track hiring stages, status notes, and recruiter feedback
            </p>
          </div>
          <Link
            to="/my-applications"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>View All Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No applications submitted yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Browse our catalog of 100+ openings and apply with your profile in 1-click.
            </p>
            <Link
              to="/jobs"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md"
            >
              <span>Explore All Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => (
              <div
                key={app._id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center shrink-0 overflow-hidden">
                    {app.job?.companyLogo || app.job?.company?.logo ? (
                      <img
                        src={app.job?.companyLogo || app.job?.company?.logo}
                        alt="Logo"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="font-bold text-brand-600">
                        {(app.job?.companyName || 'C').charAt(0)}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/jobs/${app.job?._id}`}
                        className="text-base font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition"
                      >
                        {app.job?.title || 'Position'}
                      </Link>
                      <Badge variant={app.status}>{app.status}</Badge>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {app.job?.companyName} • {app.job?.location} • Applied on{' '}
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <Link
                    to={`/jobs/${app.job?._id}`}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:border-brand-500 hover:text-brand-600 transition"
                  >
                    View Job
                  </Link>

                  <button
                    onClick={() => {
                      setTargetAppId(app._id);
                      setWithdrawModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Withdraw</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Jobs */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Recommended Roles For You
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Openings matching your skills and experience level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedJobs.map((job) => (
            <JobCard key={job._id} job={job} onBookmarkToggle={toggleBookmark} />
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        onConfirm={confirmWithdraw}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this job application? Your candidate profile and submitted resume will be removed from the employer's applicant pool."
        confirmText="Yes, Withdraw Application"
        loading={withdrawing}
        isDanger={true}
      />
    </div>
  );
};

export default CandidateDashboard;
