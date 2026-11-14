import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  PlusCircle,
  Filter,
  CheckCircle,
  Video,
  Star,
  Clock,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Building2,
  Calendar,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import Badge from '../components/common/Badge';
import CandidateProfileModal from '../components/ats/CandidateProfileModal';
import InterviewModal from '../components/ats/InterviewModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [selectedAppForProfile, setSelectedAppForProfile] = useState(null);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState(null);
  const [deleteJobModalOpen, setDeleteJobModalOpen] = useState(false);
  const [targetJobId, setTargetJobId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        setLoading(true);
        setError('');
        const [jobsRes, appsRes] = await Promise.all([
          api.get('/jobs/my/posted'),
          api.get('/applications/employer/all'),
        ]);

        if (jobsRes.data.success) {
          setMyJobs(jobsRes.data.jobs || []);
        }
        if (appsRes.data.success) {
          setApplications(appsRes.data.applications || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load employer dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEmployerData();
    }
  }, [user]);

  // Handle application status change
  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        setApplications((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
        );
        if (selectedAppForProfile && selectedAppForProfile._id === appId) {
          setSelectedAppForProfile((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to update applicant stage');
    }
  };

  const confirmDeleteJob = async () => {
    if (!targetJobId) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/jobs/${targetJobId}`);
      if (res.data.success) {
        setMyJobs((prev) => prev.filter((j) => j._id !== targetJobId));
        setDeleteJobModalOpen(false);
        setTargetJobId(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete job listing');
    } finally {
      setDeleting(false);
    }
  };

  // Metrics
  const totalJobsCount = myJobs.length;
  const activeJobsCount = myJobs.filter((j) => j.status === 'Active' || j.status === 'active').length;
  const totalApplicantsCount = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted' || a.status === 'shortlisted').length;
  const interviewsCount = applications.filter((a) => a.status === 'Interview Scheduled' || a.status === 'interview').length;
  const hiredCount = applications.filter((a) => a.status === 'Hired' || a.status === 'hired').length;

  const companyName = user?.companyDetails?.name || user?.company?.name || 'Company';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30 uppercase tracking-wider">
              Employer Talent Portal
            </span>
            <span className="text-xs text-slate-400 font-medium">• {companyName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Recruitment Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Track incoming applicant funnels, manage job openings, schedule interviews, and issue hires.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/employer/applicants"
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
          >
            Review All Applicants ({totalApplicantsCount})
          </Link>

          <Link
            to="/post-job"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Jobs</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{totalJobsCount}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Created listings</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">Active Roles</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{activeJobsCount}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Accepting applications</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Total Applicants</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">{totalApplicantsCount}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">In candidate pool</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">Shortlisted</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{shortlistedCount}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Passed stage 1</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider block">Interviews</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">{interviewsCount}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Scheduled rounds</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Hired</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{hiredCount}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Successful hires</span>
        </div>
      </div>

      {/* Pipeline Stage Distribution Progress Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Applicant Pipeline Distribution
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {totalApplicantsCount} total across all hiring stages
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${totalApplicantsCount ? (applications.filter(a => a.status === 'Applied').length / totalApplicantsCount) * 100 : 0}%` }}
            title="Applied"
          />
          <div
            className="h-full bg-amber-500 transition-all"
            style={{ width: `${totalApplicantsCount ? (applications.filter(a => a.status === 'Under Review').length / totalApplicantsCount) * 100 : 0}%` }}
            title="Under Review"
          />
          <div
            className="h-full bg-indigo-500 transition-all"
            style={{ width: `${totalApplicantsCount ? (shortlistedCount / totalApplicantsCount) * 100 : 0}%` }}
            title="Shortlisted"
          />
          <div
            className="h-full bg-purple-500 transition-all"
            style={{ width: `${totalApplicantsCount ? (interviewsCount / totalApplicantsCount) * 100 : 0}%` }}
            title="Interview Scheduled"
          />
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${totalApplicantsCount ? (hiredCount / totalApplicantsCount) * 100 : 0}%` }}
            title="Hired"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Applied</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Under Review</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Shortlisted</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Interview Scheduled</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Hired</span>
        </div>
      </div>

      {/* Recent Applicants Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Recent Candidates ({applications.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review resumes, shortlist top candidates, and schedule interview rounds
            </p>
          </div>
          <Link
            to="/employer/applicants"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>Manage All Applicants</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No applicants received yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Once candidates apply to your jobs, they will appear here with complete profiles and downloadable resumes.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 6).map((app) => {
              const cand = app.applicant || app.candidate || {};
              return (
                <div
                  key={app._id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden shadow-sm">
                      {cand.avatar ? (
                        <img src={cand.avatar} alt={cand.name} className="w-full h-full object-cover" />
                      ) : (
                        (cand.name || 'C').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{cand.name}</h4>
                        <Badge variant={app.status}>{app.status}</Badge>
                      </div>
                      <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-0.5">
                        {cand.headline || 'Candidate'} • Applied for <strong>{app.job?.title}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {cand.location || 'India'} • Applied {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setSelectedAppForProfile(app)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:border-brand-500 hover:text-brand-600 transition"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => setSelectedAppForInterview(app)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm transition flex items-center gap-1"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Interview</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(app._id, 'Shortlisted')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition"
                    >
                      Shortlist
                    </button>

                    <button
                      onClick={() => handleStatusChange(app._id, 'Rejected')}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Posted Jobs Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Your Posted Job Listings ({myJobs.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live roles accepting applications across tech categories
            </p>
          </div>
          <Link
            to="/employer/manage-jobs"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>Manage All Jobs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myJobs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No jobs posted yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Create your first job posting in minutes and start receiving qualified applications.
            </p>
            <Link
              to="/post-job"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Job</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Applicants</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {myJobs.slice(0, 5).map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      <Link to={`/jobs/${job._id}`} className="hover:text-brand-600 transition">
                        {job.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{job.category}</td>
                    <td className="px-6 py-4">{job.location}</td>
                    <td className="px-6 py-4">
                      <Badge variant={job.status}>{job.status}</Badge>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-600 dark:text-brand-400">
                      {job.applicantsCount || 0}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/employer/applicants/${job._id}`}
                        className="px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold hover:bg-brand-100 transition"
                      >
                        Applicants
                      </Link>
                      <Link
                        to={`/edit-job/${job._id}`}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 inline-block"
                        title="Edit Job"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => {
                          setTargetJobId(job._id);
                          setDeleteJobModalOpen(true);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 inline-block"
                        title="Delete Job"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CandidateProfileModal
        isOpen={!!selectedAppForProfile}
        onClose={() => setSelectedAppForProfile(null)}
        application={selectedAppForProfile}
        onStatusChange={handleStatusChange}
        onOpenScheduleInterview={(app) => setSelectedAppForInterview(app)}
      />

      <InterviewModal
        isOpen={!!selectedAppForInterview}
        onClose={() => setSelectedAppForInterview(null)}
        application={selectedAppForInterview}
        onInterviewScheduled={(updated) => {
          setApplications((prev) =>
            prev.map((a) => (a._id === updated._id ? { ...a, status: 'Interview Scheduled', interviewDetails: updated.interviewDetails } : a))
          );
        }}
      />

      <ConfirmationModal
        isOpen={deleteJobModalOpen}
        onClose={() => setDeleteJobModalOpen(false)}
        onConfirm={confirmDeleteJob}
        title="Delete Job Posting"
        message="Are you sure you want to permanently delete this job listing? All applicants associated with this post will remain archived."
        confirmText="Yes, Delete Job"
        loading={deleting}
        isDanger={true}
      />
    </div>
  );
};

export default RecruiterDashboard;
