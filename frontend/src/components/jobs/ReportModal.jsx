import React, { useState } from 'react';
import { Flag, Loader2, CheckCircle } from 'lucide-react';
import Modal from '../common/Modal';
import api from '../../services/api';

const REPORT_REASONS = [
  'Spam or Scam',
  'Misleading Job Title or Description',
  'Asking for Money or Sensitive Data',
  'Expired or Filled Listing',
  'Offensive or Inappropriate Content',
  'Other',
];

const ReportModal = ({ isOpen, onClose, jobId, jobTitle }) => {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobId) return;
    try {
      setSubmitting(true);
      setError('');
      const res = await api.post(`/jobs/${jobId}/report`, { reason, details });
      if (res.data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setDetails('');
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please log in first.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Job Listing" maxWidth="max-w-md">
      {submitted ? (
        <div className="py-6 text-center space-y-2">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Report Submitted</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Thank you for helping keep JobNova safe. Our compliance team will investigate this listing.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Reporting: <strong className="text-slate-900 dark:text-white">{jobTitle}</strong>
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Reason for Report
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Additional Details (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Provide any additional context or proof..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-500/25 transition disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ReportModal;

