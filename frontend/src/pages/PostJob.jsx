import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  IndianRupee,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Layers,
  GraduationCap,
  Users,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ALL_CATEGORIES = [
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

const WORK_MODES = ['On-site', 'Hybrid', 'Remote'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract'];
const EXPERIENCE_RANGES = ['0-1 years', '1-3 years', '3-5 years', '5-8 years', '8+ years'];

const PostJob = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    companyName: user?.companyDetails?.name || user?.company?.name || '',
    companyLogo: user?.companyDetails?.logo || user?.company?.logo || '',
    category: 'Software Development',
    workMode: 'On-site',
    jobType: 'Full-time',
    experienceRequired: '1-3 years',
    location: user?.companyDetails?.location || user?.location || 'Bengaluru, Karnataka',
    minSalary: 1200000,
    maxSalary: 2200000,
    vacancies: 2,
    educationQualification: "Bachelor's Degree in Computer Science, Engineering or related field",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: '',
    responsibilities: 'Design and develop robust microservices and user interfaces.\nConduct code reviews and champion engineering best practices.\nOptimize performance, database schemas, and caching mechanisms.',
    requirements: "3+ years of professional full-stack or backend engineering experience.\nSolid proficiency in React.js, Node.js, and MongoDB.\nExcellent problem solving and communication abilities.",
    benefits: 'Competitive Annual CTC & Stock Grant\nComprehensive Health & Term Life Insurance\nHybrid Remote Work Flexibility\nLearning, Upskilling & Conference Budget',
    requiredSkills: 'React.js, Node.js, Express, MongoDB, TypeScript, REST APIs',
    status: 'Active',
    isFeatured: false,
  });

  const [loadingJob, setLoadingJob] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // If in edit mode, fetch existing job
  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        try {
          setLoadingJob(true);
          const res = await api.get(`/jobs/${id}`);
          if (res.data.success) {
            const j = res.data.job;
            setFormData({
              title: j.title || '',
              companyName: j.companyName || '',
              companyLogo: j.companyLogo || '',
              category: j.category || 'Software Development',
              workMode: j.workMode || 'On-site',
              jobType: j.jobType || 'Full-time',
              experienceRequired: j.experienceRequired || '1-3 years',
              location: j.location || '',
              minSalary: j.minSalary || 0,
              maxSalary: j.maxSalary || 0,
              vacancies: j.vacancies || 1,
              educationQualification: j.educationQualification || '',
              deadline: j.deadline ? new Date(j.deadline).toISOString().split('T')[0] : '',
              description: j.description || '',
              responsibilities: Array.isArray(j.responsibilities) ? j.responsibilities.join('\n') : '',
              requirements: Array.isArray(j.requirements) ? j.requirements.join('\n') : '',
              benefits: Array.isArray(j.benefits) ? j.benefits.join('\n') : '',
              requiredSkills: Array.isArray(j.requiredSkills) ? j.requiredSkills.join(', ') : '',
              status: j.status || 'Active',
              isFeatured: Boolean(j.isFeatured),
            });
          }
        } catch (err) {
          setError(err.message || 'Failed to load job details');
        } finally {
          setLoadingJob(false);
        }
      };
      fetchJob();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location) {
      setError('Please provide job title, location, and description.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const payload = {
        title: formData.title,
        companyName: formData.companyName,
        companyLogo: formData.companyLogo,
        category: formData.category,
        workMode: formData.workMode,
        jobType: formData.jobType,
        experienceRequired: formData.experienceRequired,
        location: formData.location,
        minSalary: Number(formData.minSalary) || 0,
        maxSalary: Number(formData.maxSalary) || 0,
        vacancies: Number(formData.vacancies) || 1,
        educationQualification: formData.educationQualification,
        deadline: formData.deadline,
        description: formData.description,
        responsibilities: formData.responsibilities
          ? formData.responsibilities.split('\n').filter((r) => r.trim())
          : [],
        requirements: formData.requirements
          ? formData.requirements.split('\n').filter((r) => r.trim())
          : [],
        benefits: formData.benefits
          ? formData.benefits.split('\n').filter((b) => b.trim())
          : [],
        requiredSkills: formData.requiredSkills
          ? formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        status: formData.status,
        isFeatured: formData.isFeatured,
      };

      if (isEditMode) {
        const res = await api.put(`/jobs/${id}`, payload);
        if (res.data.success) {
          navigate('/employer/manage-jobs');
        }
      } else {
        const res = await api.post('/jobs', payload);
        if (res.data.success) {
          navigate('/employer/manage-jobs');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to save job posting');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingJob) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-500" />
        <p className="text-xs text-slate-400 mt-2">Loading job listing details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors space-y-6">
      <Link
        to="/employer/manage-jobs"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Manage Jobs</span>
      </Link>

      <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 uppercase tracking-wider">
            {isEditMode ? 'Edit Existing Listing' : 'Publish New Opening'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
            {isEditMode ? `Edit: ${formData.title}` : 'Post a New Job Opening'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fill in the 20 comprehensive job fields to attract top qualified candidates on JobNova.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Title, Company Name, Logo */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              1. Basic Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Senior Full Stack Engineer (React & Node.js)"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  required
                  placeholder="e.g. Infosys, Swiggy, Tech Corp"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Company Logo Image URL
                </label>
                <input
                  type="url"
                  name="companyLogo"
                  placeholder="https://images.unsplash.com/... or /uploads/..."
                  value={formData.companyLogo}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Category, Work Mode, Job Type, Experience */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              2. Classification & Work Model
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Category (30 Domains) <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Location (City, Country) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Bengaluru, Karnataka or Remote"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Work Mode
                </label>
                <select
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  {WORK_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Experience Required
                </label>
                <select
                  name="experienceRequired"
                  value={formData.experienceRequired}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  {EXPERIENCE_RANGES.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Compensation & Vacancies */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              3. Salary & Hiring Logistics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Min Salary (₹ INR)
                </label>
                <input
                  type="number"
                  name="minSalary"
                  placeholder="1200000"
                  value={formData.minSalary}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Max Salary (₹ INR)
                </label>
                <input
                  type="number"
                  name="maxSalary"
                  placeholder="2200000"
                  value={formData.maxSalary}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Vacancies
                </label>
                <input
                  type="number"
                  min="1"
                  name="vacancies"
                  value={formData.vacancies}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Education Qualification
              </label>
              <input
                type="text"
                name="educationQualification"
                placeholder="e.g. Bachelor's in CS / IT / Engineering or equivalent experience"
                value={formData.educationQualification}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Section 4: Skills & Detailed Description */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              4. Description & Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Required Skills (Comma separated) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="requiredSkills"
                required
                placeholder="React.js, Node.js, Express, MongoDB, TypeScript, Docker"
                value={formData.requiredSkills}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Job Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows="4"
                name="description"
                required
                placeholder="Detailed mission, role background, team context, and everyday responsibilities..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Responsibilities (1 bullet per line)
              </label>
              <textarea
                rows="3"
                name="responsibilities"
                placeholder="Architect scalable backend APIs\nLead sprint planning and code reviews"
                value={formData.responsibilities}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Requirements (1 bullet per line)
              </label>
              <textarea
                rows="3"
                name="requirements"
                placeholder="3+ years building production Node.js services\nStrong understanding of MongoDB queries"
                value={formData.requirements}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Benefits & Perks (1 bullet per line)
              </label>
              <textarea
                rows="3"
                name="benefits"
                placeholder="Health Insurance for self & parents\nESOP stock grant\nGym allowance"
                value={formData.benefits}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Listing Status:
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                >
                  <option value="Active">Active (Accepting Applications)</option>
                  <option value="Paused">Paused (Temporarily Hidden)</option>
                  <option value="Closed">Closed (Position Filled)</option>
                </select>
              </div>

              <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Mark as Featured Job (Boosted Visibility)</span>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <Link
              to="/employer/manage-jobs"
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition flex items-center gap-2 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{submitting ? 'Saving Listing...' : isEditMode ? 'Update Job Listing' : 'Publish Job Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
