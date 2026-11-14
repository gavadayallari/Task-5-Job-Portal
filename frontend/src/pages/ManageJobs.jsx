import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  Search,
  Eye,
  Users,
  Edit,
  Trash2,
  ExternalLink,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import Badge from '../components/common/Badge';
import ConfirmationModal from '../components/common/ConfirmationModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ManageJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetJob, setTargetJob] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/jobs/my/posted');
        if (res.data.success) {
          setJobs(res.data.jobs || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchJobs();
    }
  }, [user]);

  const handleStatusToggle = async (jobId, newStatus) => {
    try {
      const res = await api.put(`/jobs/${jobId}`, { status: newStatus });
      if (res.data.success) {
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to update job status');
    }
  };

  const confirmDelete = async () => {
    if (!targetJob) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/jobs/${targetJob._id}`);
      if (res.data.success) {
        setJobs((prev) => prev.filter((j) => j._id !== targetJob._id));
        setDeleteModalOpen(false);
        setTargetJob(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = jobs.filter((j) => {
    const matchesSearch =
      search === '' ||
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.category?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Manage Posted Jobs ({jobs.length})
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track active vacancies, applicant volumes, and listing statuses
          </p>
        </div>

        <Link
          to="/post-job"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-80 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No job postings found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Get started by posting your first opening to attract candidates.
          </p>
          <Link
            to="/post-job"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Job Listing</span>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Title & Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Compensation</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Applicants</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.map((j) => (
                <tr key={j._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4">
                    <Link to={`/jobs/${j._id}`} className="font-bold text-sm text-slate-900 dark:text-white hover:text-brand-600 block">
                      {j.title}
                    </Link>
                    <span className="text-[11px] text-slate-400">
                      {j.location} • {j.workMode} • {j.jobType}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{j.category}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {j.minSalary ? `₹${(j.minSalary / 100000).toFixed(1)}L - ₹${(j.maxSalary / 100000).toFixed(1)}L` : 'Negotiable'}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={j.status}
                      onChange={(e) => handleStatusToggle(j._id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                    >
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/employer/applicants/${j._id}`}
                      className="inline-flex items-center gap-1 font-bold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{j.applicantsCount || 0}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{j.viewsCount || 0}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      to={`/employer/applicants/${j._id}`}
                      className="px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold hover:bg-brand-100 transition"
                    >
                      Applicants
                    </Link>
                    <Link
                      to={`/edit-job/${j._id}`}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 inline-block"
                      title="Edit Job"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => {
                        setTargetJob(j);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 inline-block transition"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Job Listing"
        message={`Are you sure you want to permanently delete "${targetJob?.title}"?`}
        confirmText="Yes, Delete Job"
        loading={deleting}
        isDanger={true}
      />
    </div>
  );
};

export default ManageJobs;

