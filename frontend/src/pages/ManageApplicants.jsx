import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  FileText,
  Video,
  Download,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Briefcase,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';
import Badge from '../components/common/Badge';
import CandidateProfileModal from '../components/ats/CandidateProfileModal';
import InterviewModal from '../components/ats/InterviewModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_FILTERS = [
  'All',
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Hired',
  'Rejected',
];

const ManageApplicants = () => {
  const { jobId } = useParams();
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(jobId || 'All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [selectedAppForProfile, setSelectedAppForProfile] = useState(null);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const jobsRes = await api.get('/jobs/my/posted');
        if (jobsRes.data.success) {
          setJobs(jobsRes.data.jobs || []);
        }

        let appsRes;
        if (jobId) {
          appsRes = await api.get(`/applications/job/${jobId}`);
        } else {
          appsRes = await api.get('/applications/employer/all');
        }

        if (appsRes.data.success) {
          setApplications(appsRes.data.applications || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load applicants');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, jobId]);

  // Handle status update
  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        setApplications((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
        );
        if (selectedAppForProfile && selectedAppForProfile._id === appId) {
          setSelectedAppForProfile((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to update candidate status');
    }
  };

  const filtered = applications.filter((app) => {
    const cand = app.applicant || app.candidate || {};
    const matchesSearch =
      search === '' ||
      cand.name?.toLowerCase().includes(search.toLowerCase()) ||
      cand.email?.toLowerCase().includes(search.toLowerCase()) ||
      cand.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesJob = selectedJobId === 'All' || (app.job?._id || app.job) === selectedJobId;

    return matchesSearch && matchesStatus && matchesJob;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {jobId && (
            <Link
              to="/employer/manage-jobs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Manage Jobs</span>
            </Link>
          )}
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Manage Candidates & Applications ({filtered.length})
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review candidate resumes, shortlist talent, and coordinate interview stages
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-80 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search candidate name, email, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Job Filter */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span>Role:</span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Jobs ({jobs.length})</option>
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span>Stage:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applicants List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No applicants matching filter</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try resetting your search query or role/stage filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const cand = app.applicant || app.candidate || {};
            return (
              <div
                key={app._id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Candidate Info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shrink-0 overflow-hidden shadow-sm">
                    {cand.avatar ? (
                      <img src={cand.avatar} alt={cand.name} className="w-full h-full object-cover" />
                    ) : (
                      (cand.name || 'C').charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedAppForProfile(app)}
                        className="text-base font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition"
                      >
                        {cand.name}
                      </button>
                      <Badge variant={app.status}>{app.status}</Badge>
                    </div>

                    <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                      Applied for: <strong>{app.job?.title || 'Job'}</strong>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                      {cand.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {cand.location}
                        </span>
                      )}
                      {cand.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" /> {cand.email}
                        </span>
                      )}
                      <span className="text-slate-400">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Candidate Skills Snippet */}
                    {cand.skills && cand.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {cand.skills.slice(0, 5).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions & Status Dropdown */}
                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-800">
                  {/* Status Dropdown */}
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button
                    onClick={() => setSelectedAppForProfile(app)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:border-brand-500 hover:text-brand-600 transition"
                  >
                    View CV / Profile
                  </button>

                  <button
                    onClick={() => setSelectedAppForInterview(app)}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Schedule Interview</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
            prev.map((a) =>
              a._id === updated._id
                ? { ...a, status: 'Interview Scheduled', interviewDetails: updated.interviewDetails }
                : a
            )
          );
        }}
      />
    </div>
  );
};

export default ManageApplicants;

