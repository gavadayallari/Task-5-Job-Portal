import React from 'react';
import { Search, Filter, RotateCcw, MapPin, Briefcase, IndianRupee, Layers } from 'lucide-react';

const ALL_CATEGORIES = [
  'All',
  'Software Development',
  'Web Development',
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Mobile App Development',
  'UI/UX Design',
  'Graphic Design',
  'Data Science',
  'Data Analytics',
  'Artificial Intelligence',
  'Machine Learning',
  'Cyber Security',
  'Cloud Computing',
  'DevOps',
  'Digital Marketing',
  'SEO',
  'Content Writing',
  'Business Development',
  'Sales & Marketing',
  'Human Resources',
  'Finance & Accounting',
  'Banking',
  'Customer Support',
  'Education & Teaching',
  'Healthcare',
  'Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Government Jobs',
];

const LOCATIONS = [
  'All',
  'Bengaluru, Karnataka',
  'Pune, Maharashtra',
  'Hyderabad, Telangana',
  'Mumbai, Maharashtra',
  'Delhi NCR, Delhi',
  'Chennai, Tamil Nadu',
  'Ahmedabad, Gujarat',
  'Indore, Madhya Pradesh',
  'Remote',
];

const WORK_MODES = ['All', 'Remote', 'Hybrid', 'On-site'];
const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Internship', 'Contract'];
const EXPERIENCE_RANGES = ['All', '0-1 years', '1-3 years', '3-5 years', '5+ years'];

const JobFilters = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-500" />
          Filter Jobs
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Search Title, Company, Skills
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="e.g. React, Infosys, Python..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          />
        </div>
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-brand-500" />
          Job Category ({ALL_CATEGORIES.length - 1})
        </label>
        <select
          value={filters.category || 'All'}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
        >
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          Location
        </label>
        <select
          value={filters.location || 'All'}
          onChange={(e) => onFilterChange('location', e.target.value)}
          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Work Mode */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Work Mode
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {WORK_MODES.map((mode) => {
            const isSelected = (filters.workMode || 'All') === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => onFilterChange('workMode', mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Type */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Job Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {JOB_TYPES.map((type) => {
            const isSelected = (filters.jobType || 'All') === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onFilterChange('jobType', type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Experience Required
        </label>
        <div className="flex flex-wrap gap-1.5">
          {EXPERIENCE_RANGES.map((exp) => {
            const isSelected = (filters.experience || 'All') === exp;
            return (
              <button
                key={exp}
                type="button"
                onClick={() => onFilterChange('experience', exp)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {exp}
              </button>
            );
          })}
        </div>
      </div>

      {/* Salary Filter (in INR LPA) */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
          Min Salary (₹ LPA)
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'Any', value: '' },
            { label: '₹6L+', value: '600000' },
            { label: '₹12L+', value: '1200000' },
            { label: '₹20L+', value: '2000000' },
          ].map((item) => {
            const isSelected = (filters.minSalary || '') === item.value;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onFilterChange('minSalary', item.value)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
