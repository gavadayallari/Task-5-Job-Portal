import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Building2,
  Trash2,
  AlertTriangle,
  Layers,
  Flag,
  BarChart2,
  PlusCircle,
  Edit,
  Clock,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import Badge from '../components/common/Badge';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Modal from '../components/common/Modal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // overview, users, employers, jobs, reports, categories
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Users tab state
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  // Jobs tab state
  const [jobs, setJobs] = useState([]);
  const [jobSearch, setJobSearch] = useState('');
  const [jobApprovalFilter, setJobApprovalFilter] = useState('All');

  // Companies state
  const [companies, setCompanies] = useState([]);

  // Reports state
  const [reports, setReports] = useState([]);

  // Categories state
  const [categories, setCategories] = useState([]);
  const [newCatModalOpen, setNewCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Briefcase');

  // Delete modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', id: '', name: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/jobs');
      return;
    }

    const fetchAdminDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const [dashRes, usersRes, jobsRes, compRes, repRes, catRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/users?limit=50'),
          api.get('/admin/jobs?limit=50'),
          api.get('/companies?limit=50'),
          api.get('/admin/reports'),
          api.get('/categories'),
        ]);

        if (dashRes.data.success) {
          setDashboardData(dashRes.data);
        }
        if (usersRes.data.success) {
          setUsers(usersRes.data.users);
        }
        if (jobsRes.data.success) {
          setJobs(jobsRes.data.jobs);
        }
        if (compRes.data.success) {
          setCompanies(compRes.data.companies);
        }
        if (repRes.data.success) {
          setReports(repRes.data.reports || []);
        }
        if (catRes.data.success) {
          setCategories(catRes.data.categories || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load administration data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAdminDashboard();
    }
  }, [user, navigate]);

  // Toggle user status
  const handleToggleUserStatus = async (userId, currentActive) => {
    try {
      const res = await api.put(`/admin/users/${userId}/status`, { isActive: !currentActive });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: !currentActive } : u))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    }
  };

  // Approve / Reject Job
  const handleApproveJob = async (jobId, status) => {
    try {
      const res = await api.put(`/admin/jobs/${jobId}/approve`, { approvalStatus: status });
      if (res.data.success) {
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, approvalStatus: status } : j))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to update job approval status');
    }
  };

  // Resolve Report
  const handleResolveReport = async (reportId, actionTaken, deleteJobFlag = false) => {
    try {
      const res = await api.put(`/admin/reports/${reportId}`, {
        status: deleteJobFlag ? 'Action Taken' : 'Dismissed',
        actionTaken,
        deleteJobFlag,
      });
      if (res.data.success) {
        setReports((prev) =>
          prev.map((r) => (r._id === reportId ? res.data.report : r))
        );
        if (deleteJobFlag) {
          // refresh jobs
          const jobsRes = await api.get('/admin/jobs?limit=50');
          if (jobsRes.data.success) setJobs(jobsRes.data.jobs);
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to update report');
    }
  };

  // Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await api.post('/categories', {
        name: newCatName.trim(),
        description: newCatDesc.trim(),
        icon: newCatIcon,
      });
      if (res.data.success) {
        setCategories((prev) => [...prev, res.data.category]);
        setNewCatName('');
        setNewCatDesc('');
        setNewCatModalOpen(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to create category');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await api.delete(`/categories/${catId}`);
      if (res.data.success) {
        setCategories((prev) => prev.filter((c) => c._id !== catId));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete category');
    }
  };

  // Delete handler for user or job
  const handleConfirmDelete = async () => {
    if (!deleteTarget.id) return;
    try {
      setActionLoading(true);
      if (deleteTarget.type === 'user') {
        const res = await api.delete(`/admin/users/${deleteTarget.id}`);
        if (res.data.success) {
          setUsers((prev) => prev.filter((u) => u._id !== deleteTarget.id));
        }
      } else if (deleteTarget.type === 'job') {
        const res = await api.delete(`/admin/jobs/${deleteTarget.id}`);
        if (res.data.success) {
          setJobs((prev) => prev.filter((j) => j._id !== deleteTarget.id));
        }
      }
      setConfirmModalOpen(false);
      setDeleteTarget({ type: '', id: '', name: '' });
    } catch (err) {
      alert(err.message || 'Failed to complete deletion');
    } finally {
      setActionLoading(false);
    }
  };

  const stats = dashboardData?.stats || {
    totalUsers: 0,
    totalJobSeekers: 0,
    totalEmployers: 0,
    totalActiveJobs: 0,
    totalApplications: 0,
    pendingJobApprovals: 0,
    totalCompanies: 0,
    pendingReports: 0,
  };

  const analytics = dashboardData?.analytics || {
    jobsByCategory: [],
    applicationsByStatus: [],
    jobsByWorkMode: [],
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      userSearch === '' ||
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole =
      userRoleFilter === 'All' ||
      u.role === userRoleFilter ||
      (userRoleFilter === 'jobseeker' && (u.role === 'jobseeker' || u.role === 'candidate')) ||
      (userRoleFilter === 'employer' && (u.role === 'employer' || u.role === 'recruiter'));
    return matchesSearch && matchesRole;
  });

  // Filtered jobs
  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      jobSearch === '' ||
      j.title?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.companyName?.toLowerCase().includes(jobSearch.toLowerCase());
    const matchesApproval =
      jobApprovalFilter === 'All' || j.approvalStatus === jobApprovalFilter;
    return matchesSearch && matchesApproval;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-purple-900/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Master Governance
            </span>
            <span className="text-xs text-purple-200">• JobNova Platform Operations</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Administrator Command Suite
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
            Audit platform metrics, manage employers, approve job listings, resolve safety reports, and manage categories.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="purple" className="px-3 py-1 font-bold">
            Live Database Synced
          </Badge>
        </div>
      </div>

      {/* Primary KPI Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{stats.totalUsers}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">All registered</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">Job Seekers</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{stats.totalJobSeekers}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Candidate pool</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">Employers</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400">{stats.totalEmployers}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Verified hiring</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">Active Jobs</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{stats.totalActiveJobs}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Public listings</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Applications</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">{stats.totalApplications}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Submitted</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">Safety Reports</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">{reports.filter(r => r.status === 'Pending').length}</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Pending review</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: 'Platform Analytics', icon: BarChart2 },
          { id: 'users', label: `Users (${users.length})`, icon: Users },
          { id: 'employers', label: `Companies (${companies.length})`, icon: Building2 },
          { id: 'jobs', label: `Job Listings (${jobs.length})`, icon: Briefcase },
          { id: 'reports', label: `Reports (${reports.length})`, icon: Flag },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Categories Distribution */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-500" />
                Jobs Distribution by Top Category
              </h3>
              <div className="space-y-3">
                {analytics.jobsByCategory.slice(0, 7).map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{item._id}</span>
                      <span>{item.count} jobs</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-indigo-600 rounded-full"
                        style={{ width: `${Math.min(100, (item.count / 30) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Applications Stage Split */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Applications Status Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {analytics.applicationsByStatus.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
                  >
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {item._id}
                    </span>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 w-full sm:w-80 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-bold text-slate-500">Role:</span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
              >
                <option value="All">All Roles</option>
                <option value="jobseeker">Job Seekers</option>
                <option value="employer">Employers</option>
                <option value="admin">Administrators</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-brand-600 shrink-0 overflow-hidden">
                          {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : u.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={u.role === 'admin' ? 'purple' : u.role === 'employer' || u.role === 'recruiter' ? 'warning' : 'primary'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">{u.location || 'India'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={u.isActive ? 'active' : 'closed'}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleUserStatus(u._id, u.isActive)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                          u.isActive
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 hover:bg-amber-100'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
                        }`}
                      >
                        {u.isActive ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget({ type: 'user', id: u._id, name: u.name });
                          setConfirmModalOpen(true);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EMPLOYERS & COMPANIES */}
      {activeTab === 'employers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((comp) => (
              <div
                key={comp._id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 p-2 flex items-center justify-center shrink-0 overflow-hidden">
                      {comp.logo ? <img src={comp.logo} alt="" className="w-full h-full object-cover" /> : comp.name.charAt(0)}
                    </div>
                    <Badge variant={comp.isVerified ? 'success' : 'default'}>
                      {comp.isVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">{comp.name}</h4>
                    <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">{comp.industry}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{comp.location}</p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {comp.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {comp.activeJobsCount || 0} Open Roles
                  </span>
                  <Link
                    to={`/companies/${comp._id}`}
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: JOB APPROVALS & LISTINGS */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 w-full sm:w-80 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search job title or company..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="w-full text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-bold text-slate-500">Approval:</span>
              <select
                value={jobApprovalFilter}
                onChange={(e) => setJobApprovalFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Title & Company</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Approval</th>
                  <th className="px-6 py-4">Applicants</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredJobs.map((j) => (
                  <tr key={j._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <Link to={`/jobs/${j._id}`} className="font-bold text-slate-900 dark:text-white hover:text-brand-600 block">
                        {j.title}
                      </Link>
                      <span className="text-[11px] text-slate-400">{j.companyName} • {j.location}</span>
                    </td>
                    <td className="px-6 py-4">{j.category}</td>
                    <td className="px-6 py-4">
                      <Badge variant={j.approvalStatus === 'Approved' ? 'success' : j.approvalStatus === 'Pending' ? 'warning' : 'danger'}>
                        {j.approvalStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-600">{j.applicantsCount || 0}</td>
                    <td className="px-6 py-4">{new Date(j.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {j.approvalStatus !== 'Approved' && (
                        <button
                          onClick={() => handleApproveJob(j._id, 'Approved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold hover:bg-emerald-100"
                        >
                          Approve
                        </button>
                      )}
                      {j.approvalStatus !== 'Rejected' && (
                        <button
                          onClick={() => handleApproveJob(j._id, 'Rejected')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold hover:bg-rose-100"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setDeleteTarget({ type: 'job', id: j._id, name: j.title });
                          setConfirmModalOpen(true);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition"
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
        </div>
      )}

      {/* TAB 5: REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">All clean! No safety reports</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">There are no pending flagged listings.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep._id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-600 dark:text-rose-400 text-xs uppercase tracking-wider">
                        [{rep.reason}]
                      </span>
                      <Badge variant={rep.status === 'Pending' ? 'danger' : 'success'}>
                        {rep.status}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Reported Job: {rep.job?.title || 'Job Listing'}
                    </h4>
                    {rep.details && (
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        <strong>Reporter Note:</strong> {rep.details}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400">
                      Reported by {rep.reporter?.name} ({rep.reporter?.email}) on {new Date(rep.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {rep.status === 'Pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleResolveReport(rep._id, 'Listing removed for policy breach', true)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 shadow-sm"
                      >
                        Delete Job
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep._id, 'Report reviewed and dismissed as valid', false)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Platform Categories ({categories.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage all 30 job categories and their active listings count
              </p>
            </div>
            <button
              onClick={() => setNewCatModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{cat.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{cat.jobCount || 0} Live Jobs</p>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      <Modal
        isOpen={newCatModalOpen}
        onClose={() => setNewCatModalOpen(false)}
        title="Add New Job Category"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Quantum Computing"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows="3"
              placeholder="Brief summary of roles in this domain..."
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setNewCatModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/25"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Confirm Delete ${deleteTarget.type === 'user' ? 'User' : 'Job'}`}
        message={`Are you sure you want to permanently delete "${deleteTarget.name}"? This action cannot be reverted.`}
        confirmText="Yes, Permanently Delete"
        loading={actionLoading}
        isDanger={true}
      />
    </div>
  );
};

export default AdminDashboard;
