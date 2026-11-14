import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, FileText, Loader2, IndianRupee } from 'lucide-react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ApplyModal = ({ isOpen, onClose, job, onApplySuccess }) => {
  const { user, refreshUser } = useAuth();
  const [resumeMode, setResumeMode] = useState(user?.resumeUrl ? 'saved' : 'upload');
  const [resumeFile, setResumeFile] = useState(null);
  const [phone, setPhone] = useState(user?.phone || '');
  const [coverLetter, setCoverLetter] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('Immediate');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    let finalResumeUrl = user?.resumeUrl;
    let finalResumeName = user?.resumeOriginalName || 'Resume.pdf';

    // If uploading new resume file
    if (resumeMode === 'upload') {
      if (!resumeFile) {
        setError('Please select a resume file (PDF, DOC, or DOCX) to upload.');
        return;
      }
      try {
        setSubmitting(true);
        const uploadData = new FormData();
        uploadData.append('resume', resumeFile);
        const upRes = await api.post('/auth/resume', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (upRes.data.success) {
          finalResumeUrl = upRes.data.resumeUrl;
          finalResumeName = upRes.data.resumeOriginalName;
          await refreshUser();
        }
      } catch (err) {
        setError(err.message || 'Failed to upload resume file.');
        setSubmitting(false);
        return;
      }
    } else {
      if (!finalResumeUrl) {
        setError('No saved resume found on your profile. Please choose "Upload New Resume".');
        return;
      }
    }

    try {
      setSubmitting(true);
      const res = await api.post('/applications', {
        jobId: job._id,
        resumeUrl: finalResumeUrl,
        resumeOriginalName: finalResumeName,
        phone,
        coverLetter,
        expectedSalary: Number(expectedSalary) || 0,
        noticePeriod,
        portfolioUrl,
      });

      if (res.data.success) {
        setSuccessMsg('Your application has been successfully submitted!');
        setTimeout(() => {
          if (onApplySuccess) onApplySuccess(res.data.application);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application. You may have already applied.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply for ${job.title}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Summary Banner */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center font-bold text-brand-600 dark:text-brand-400 shadow-sm shrink-0 overflow-hidden">
            {job.companyLogo || job.company?.logo ? (
              <img
                src={job.companyLogo || job.company?.logo}
                alt={job.companyName}
                className="w-full h-full object-cover"
              />
            ) : (
              (job.companyName || 'C').charAt(0)
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{job.title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {job.companyName || job.company?.name} • {job.location} • {job.workMode}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Resume Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Select Resume <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              type="button"
              onClick={() => setResumeMode('saved')}
              className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                resumeMode === 'saved'
                  ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <div>
                <p className="text-xs font-bold">Profile Resume</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[130px]">
                  {user?.resumeOriginalName || 'Default CV'}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setResumeMode('upload')}
              className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                resumeMode === 'upload'
                  ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <div>
                <p className="text-xs font-bold">Upload New</p>
                <p className="text-[10px] text-slate-400">PDF, DOC, DOCX</p>
              </div>
            </button>
          </div>

          {resumeMode === 'upload' && (
            <div className="mt-2">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 dark:file:bg-brand-950/60 file:text-brand-700 dark:file:text-brand-300 hover:file:bg-brand-100"
              />
            </div>
          )}
        </div>

        {/* Contact Phone & Expected Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Expected Salary (₹ Annual CTC)
            </label>
            <input
              type="number"
              placeholder="e.g. 1800000"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Notice Period & Portfolio Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Notice Period
            </label>
            <select
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="Immediate">Immediate / Serving Notice</option>
              <option value="15 Days">15 Days</option>
              <option value="30 Days">30 Days (1 Month)</option>
              <option value="60 Days">60 Days (2 Months)</option>
              <option value="90 Days">90 Days (3 Months)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              GitHub / Portfolio URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/yourhandle"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Cover Letter / Pitch Note
          </label>
          <textarea
            rows="3"
            placeholder="Briefly describe why you are a great match for this position..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Actions */}
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
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/25 transition disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{submitting ? 'Submitting Application...' : 'Submit Application'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyModal;
