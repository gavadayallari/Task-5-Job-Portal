import React, { useState } from 'react';
import { Star, MessageSquare, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import api from '../../services/api';

const RecruiterNoteModal = ({ isOpen, onClose, application, onNoteAdded }) => {
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!application) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) {
      setError('Please enter a note');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await api.post(`/applications/${application._id}/notes`, {
        note,
        rating,
      });

      if (res.data.success) {
        if (onNoteAdded) onNoteAdded(application._id, res.data.recruiterNotes);
        setNote('');
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to add evaluation note');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Evaluate: ${application.candidate?.name}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Internal Rating (1 - 5 Stars)
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className="p-1 hover:scale-110 transition"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-200'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-semibold text-slate-600 ml-2">
              {rating} / 5 Stars
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Recruiter Assessment Note
          </label>
          <textarea
            rows="4"
            required
            placeholder="Document code review insights, communication skills, or salary negotiation details..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition resize-none"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition flex items-center gap-1.5"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              'Save Evaluation'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RecruiterNoteModal;
