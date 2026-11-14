import React, { useState } from 'react';
import { Calendar, Clock, Video, Link as LinkIcon, FileText, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import api from '../../services/api';

const InterviewModal = ({ isOpen, onClose, application, onInterviewScheduled }) => {
  const [scheduledDate, setScheduledDate] = useState('');
  const [time, setTime] = useState('02:30 PM IST');
  const [mode, setMode] = useState('Google Meet');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/jobnova-tech-round');
  const [notes, setNotes] = useState('Technical discussion & coding evaluation');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!application) return null;

  const candidateName = application.applicant?.name || application.candidate?.name || 'Candidate';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduledDate || !time) {
      setError('Please select both date and time.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const res = await api.put(`/applications/${application._id}/status`, {
        status: 'Interview Scheduled',
        interviewDetails: {
          date: scheduledDate,
          time,
          mode,
          meetingLink,
          notes,
        },
        note: `Interview scheduled on ${scheduledDate} at ${time} via ${mode}`,
      });

      if (res.data.success) {
        if (onInterviewScheduled) onInterviewScheduled(res.data.application);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to schedule interview');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Schedule Interview: ${candidateName}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800 p-3.5 rounded-xl text-xs text-purple-900 dark:text-purple-300">
          <p className="font-bold">Role: {application.job?.title}</p>
          <p className="mt-0.5 opacity-90">
            Scheduling this interview will notify <strong>{candidateName}</strong> and mark their stage as{' '}
            <span className="font-semibold text-purple-700 dark:text-purple-400">Interview Scheduled</span>.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Time (IST) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 02:30 PM IST"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Interview Platform
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="Google Meet">Google Meet</option>
            <option value="Zoom">Zoom Meeting</option>
            <option value="Microsoft Teams">Microsoft Teams</option>
            <option value="In-Person">In-Person Office Interview</option>
            <option value="Phone Call">Phone Call</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Meeting Link or Office Address
          </label>
          <div className="relative">
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="https://meet.google.com/xyz-abc or Office Building"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Interview Agenda & Notes
          </label>
          <textarea
            rows="3"
            placeholder="Key discussion topics, coding round, or requirements..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/25 transition disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{submitting ? 'Scheduling...' : 'Confirm Schedule'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InterviewModal;
