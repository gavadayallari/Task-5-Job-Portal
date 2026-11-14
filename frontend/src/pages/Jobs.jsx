import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  SlidersHorizontal,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  Layers,
  MapPin,
} from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import { JobCardSkeleton } from '../components/common/SkeletonLoader';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const defaultFilters = {
  search: '',
  category: 'All',
  location: 'All',
  workMode: 'All',
  jobType: 'All',
  experience: 'All',
  minSalary: '',
  sort: 'latest',
  page: 1,
};

const SORT_OPTIONS = [
  { label: 'Newest Posted', value: 'latest' },
  { label: 'Salary: High to Low', value: 'salary_desc' },
  { label: 'Salary: Low to High', value: 'salary_asc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Upcoming Deadline', value: 'deadline' },
];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleBookmark } = useAuth();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    location: searchParams.get('location') || 'All',
    workMode: searchParams.get('workMode') || 'All',
    jobType: searchParams.get('jobType') || 'All',
    experience: searchParams.get('experience') || 'All',
    minSalary: searchParams.get('minSalary') || '',
    sort: searchParams.get('sort') || 'latest',
    page: parseInt(searchParams.get('page'), 10) || 1,
  });

  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL search params change externally
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    const urlLocation = searchParams.get('location');
    if (urlCategory || urlSearch || urlLocation) {
      setFilters((prev) => ({
        ...prev,
        category: urlCategory || prev.category,
        search: urlSearch !== null ? urlSearch : prev.search,
        location: urlLocation || prev.location,
        page: 1,
      }));
    }
  }, [searchParams]);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.category && filters.category !== 'All') params.append('category', filters.category);
        if (filters.location && filters.location !== 'All') params.append('location', filters.location);
        if (filters.workMode && filters.workMode !== 'All') params.append('workMode', filters.workMode);
        if (filters.jobType && filters.jobType !== 'All') params.append('jobType', filters.jobType);
        if (filters.experience && filters.experience !== 'All') params.append('experience', filters.experience);
        if (filters.minSalary) params.append('minSalary', filters.minSalary);
        if (filters.sort) params.append('sort', filters.sort);
        params.append('page', filters.page);
        params.append('limit', '9');

        const res = await api.get(`/jobs?${params.toString()}`);
        if (res.data.success) {
          setJobs(res.data.jobs);
          setTotalJobs(res.data.total || 0);
          setTotalPages(res.data.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1,
    }));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Determine active filter count
  const activeFiltersCount = Object.entries(filters).filter(([key, val]) => {
    if (key === 'page' || key === 'sort') return false;
    if (key === 'search' || key === 'minSalary') return val && val.trim() !== '';
    return val && val !== 'All';
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Browse All Job Openings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Showing <strong className="text-slate-900 dark:text-white">{totalJobs}</strong> verified openings across India and Remote
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters ({activeFiltersCount})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Sort by:
            </span>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Filters:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              "{filters.search}"
              <button onClick={() => handleFilterChange('search', '')}><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          {filters.category !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Category: {filters.category}
              <button onClick={() => handleFilterChange('category', 'All')}><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          {filters.location !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              {filters.location}
              <button onClick={() => handleFilterChange('location', 'All')}><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          {filters.workMode !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
              {filters.workMode}
              <button onClick={() => handleFilterChange('workMode', 'All')}><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          {filters.jobType !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {filters.jobType}
              <button onClick={() => handleFilterChange('jobType', 'All')}><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          {filters.experience !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Exp: {filters.experience}
              <button onClick={() => handleFilterChange('experience', 'All')}><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          {filters.minSalary && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ₹{(Number(filters.minSalary) / 100000).toFixed(0)}L+ CTC
              <button onClick={() => handleFilterChange('minSalary', '')}><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          <button
            onClick={handleReset}
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24">
          <JobFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </aside>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg mx-auto my-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
              <JobFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
              />
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-4 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-md"
              >
                Apply Filters & View Results
              </button>
            </div>
          </div>
        )}

        {/* Jobs Listing Column */}
        <section className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No job openings found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                We couldn't find any job matches for your current search criteria. Try loosening your filters or resetting search keywords.
              </p>
              <button
                onClick={handleReset}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onBookmarkToggle={toggleBookmark}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page <= 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Page <span className="text-slate-900 dark:text-white font-bold">{filters.page}</span> of{' '}
                <span className="text-slate-900 dark:text-white font-bold">{totalPages}</span>
              </div>

              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= totalPages}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Jobs;
