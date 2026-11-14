import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Briefcase, Trash2, ArrowRight, ArrowUpRight } from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import ApplyModal from '../components/jobs/ApplyModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const SavedJobs = () => {
  const { user, toggleBookmark } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyJob, setApplyJob] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/saved-jobs');
        if (res.data.success) {
          setSavedJobs(res.data.savedJobs || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load saved jobs');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  const handleRemove = async (jobId) => {
    try {
      await toggleBookmark(jobId);
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Saved Job Bookmarks ({savedJobs.length})
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review saved positions and submit applications at your convenience
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Bookmark className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No saved jobs yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Click the bookmark icon on any job card to save it here for later.
          </p>
          <Link
            to="/jobs"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            <span>Browse Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isBookmarked={true}
              onBookmarkToggle={() => handleRemove(job._id)}
            />
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {applyJob && (
        <ApplyModal
          isOpen={!!applyJob}
          onClose={() => setApplyJob(null)}
          job={applyJob}
        />
      )}
    </div>
  );
};

export default SavedJobs;

