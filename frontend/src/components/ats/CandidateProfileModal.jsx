import React from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Download,
  Calendar,
  Clock,
  ExternalLink,
  Award,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';

const CandidateProfileModal = ({
  isOpen,
  onClose,
  application,
  onStatusChange,
  onOpenScheduleInterview,
}) => {
  if (!application) return null;

  const candidate = application.applicant || application.candidate || {};
  const status = application.status || 'Applied';
  const resumeUrl = application.resumeUrl || candidate.resumeUrl;
  const resumeName = application.resumeOriginalName || candidate.resumeOriginalName || 'Resume.pdf';

  const getFullResumeUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http')) return url;
    const base = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5004';
    return `${base}${url}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Profile & Application"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Header Profile Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-sm shrink-0">
              {candidate.avatar ? (
                <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover" />
              ) : (
                (candidate.name || 'C').charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{candidate.name}</h3>
                <Badge variant={status}>{status}</Badge>
              </div>
              <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-0.5">
                {candidate.headline || 'Job Seeker'}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                {candidate.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {candidate.location}
                  </span>
                )}
                {candidate.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {candidate.email}
                  </span>
                )}
                {(application.phone || candidate.phone) && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {application.phone || candidate.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Download Resume Button */}
          {resumeUrl && (
            <a
              href={getFullResumeUrl(resumeUrl)}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 transition shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Resume</span>
            </a>
          )}
        </div>

        {/* Application Specifics (Notice Period, Expected CTC, Applied Date) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Applied For</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{application.job?.title || 'Job'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Expected CTC</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {application.expectedSalary ? `₹${(application.expectedSalary / 100000).toFixed(1)} LPA` : 'Not specified'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Notice Period</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{application.noticePeriod || 'Immediate'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Applied On</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {new Date(application.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Cover Letter */}
        {application.coverLetter && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Cover Letter / Statement
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {application.coverLetter}
            </div>
          </div>
        )}

        {/* Skills */}
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Verified Candidate Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {candidate.experience && candidate.experience.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-brand-500" />
              Work Experience
            </h4>
            <div className="space-y-2.5">
              {candidate.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">{exp.title}</h5>
                    <span className="text-xs text-slate-400">{exp.duration || `${exp.startDate} - ${exp.endDate || 'Present'}`}</span>
                  </div>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">{exp.company} • {exp.location}</p>
                  {exp.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {candidate.education && candidate.education.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-500" />
              Education Details
            </h4>
            <div className="space-y-2">
              {candidate.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">{edu.degree}</h5>
                    <span className="text-xs text-slate-400">{edu.year || `${edu.startYear} - ${edu.endYear}`}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{edu.institution} {edu.grade ? `• Grade: ${edu.grade}` : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Interview Details (If active) */}
        {application.status === 'Interview Scheduled' && application.interviewDetails && (
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center gap-1.5 mb-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              Active Interview Scheduled
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-purple-800 dark:text-purple-300">
              <p><strong>Date:</strong> {new Date(application.interviewDetails.date || application.interviewDetails.scheduledDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {application.interviewDetails.time}</p>
              <p><strong>Mode:</strong> {application.interviewDetails.mode}</p>
              <p>
                <strong>Link:</strong>{' '}
                <a
                  href={application.interviewDetails.meetingLink || application.interviewDetails.link}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-brand-600 dark:text-brand-400"
                >
                  Join Meeting
                </a>
              </p>
            </div>
            {application.interviewDetails.notes && (
              <p className="text-xs text-purple-700 dark:text-purple-400 mt-2">
                <strong>Notes:</strong> {application.interviewDetails.notes}
              </p>
            )}
          </div>
        )}

        {/* Stage Management Actions for Recruiter */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onStatusChange(application._id, 'Shortlisted')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100"
            >
              Shortlist
            </button>

            <button
              onClick={() => {
                onClose();
                if (onOpenScheduleInterview) onOpenScheduleInterview(application);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-sm"
            >
              Schedule Interview
            </button>

            <button
              onClick={() => onStatusChange(application._id, 'Hired')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
            >
              Mark as Hired
            </button>

            <button
              onClick={() => onStatusChange(application._id, 'Rejected')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CandidateProfileModal;

