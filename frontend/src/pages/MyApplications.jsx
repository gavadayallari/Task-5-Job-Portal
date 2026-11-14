import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Clock,
  Building2,
  MapPin,
  Trash2,
  Video,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import Badge from '../components/common/Badge';
import ConfirmationModal from '../components/common/ConfirmationModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_TABS = [
  'All',
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Hired',
  'Rejected',
];

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [activeStatus, setActiveStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [targetAppId, setTargetAppId] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/applications/my');
        if (res.data.success) {
          setApplications(res.data.applications || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  const confirmWithdraw = async () => {
    if (!targetAppId) return;
    try {
      setWithdrawing(true);
      const res = await api.delete(`/applications/${targetAppId}`);
      if (res.data.success) {
        setApplications((prev) => prev.filter((a) => a._id !== targetAppId));
        setWithdrawModalOpen(false);
        setTargetAppId(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to withdraw application');
    } finally {
      setWithdrawing(false);
    }
  };

  const filtered = applications.filter((app) => {
    if (activeStatus === 'All') return true;
    return app.status === activeStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Applications
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor your application lifecycle, upcoming interview invitations, and status changes
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {STATUS_TABS.map((status) => {
          const count =
            status === 'All'
              ? applications.length
              : applications.filter((a) => a.status === status).length;
          const isActive = activeStatus === status;
          return (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{status}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No applications in "{activeStatus}" stage
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Check other tabs or discover open roles on the job catalog.
          </p>
          <Link
            to="/jobs"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            <span>Explore Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div
              key={app._id}
              className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                    {app.job?.companyLogo || app.job?.company?.logo ? (
                      <img
                        src={app.job?.companyLogo || app.job?.company?.logo}
                        alt="Logo"
                        className="w-full h-full object-cover rounded-xl"
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
                        className="text-lg font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition"
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

                <div className="flex items-center gap-3 shrink-0">
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
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Withdraw</span>
                  </button>
                </div>
              </div>

              {/* Highlight Active Interview Schedule */}
              {app.status === 'Interview Scheduled' && app.interviewDetails && (
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-purple-900 dark:text-purple-200">
                        Interview Confirmed with Hiring Squad
                      </h4>
                      <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">
                        Scheduled for{' '}
                        <strong>
                          {new Date(
                            app.interviewDetails.date || app.interviewDetails.scheduledDate
                          ).toLocaleDateString()}{' '}
                          at {app.interviewDetails.time}
                        </strong>{' '}
                        via {app.interviewDetails.mode}
                      </p>
                      {app.interviewDetails.notes && (
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                          <strong>Note:</strong> {app.interviewDetails.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {app.interviewDetails.meetingLink && (
                    <a
                      href={app.interviewDetails.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition shrink-0"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Call</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Status Timeline History */}
              {app.statusHistory && app.statusHistory.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Application Timeline
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                    {app.statusHistory.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{step.status}</span>
                        <span className="text-[10px] text-slate-400">({new Date(step.updatedAt).toLocaleDateString()})</span>
                        {idx < app.statusHistory.length - 1 && <span className="text-slate-300">→</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Withdraw Modal */}
      <ConfirmationModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        onConfirm={confirmWithdraw}
        title="Withdraw Application"
        message="Are you sure you want to withdraw your application? This will remove your submission from the employer's review portal."
        confirmText="Yes, Withdraw Application"
        loading={withdrawing}
        isDanger={true}
      />
    </div>
  );
};

export default MyApplications;

