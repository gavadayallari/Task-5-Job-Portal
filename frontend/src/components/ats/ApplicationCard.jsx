import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Star,
  Clock,
  DollarSign,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Video,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Badge from '../common/Badge';

const STAGES = [
  { id: 'applied', label: 'Applied' },
  { id: 'under-review', label: 'Under Review' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'interview', label: 'Interview' },
  { id: 'hired', label: 'Hired' },
  { id: 'rejected', label: 'Rejected' },
];

const ApplicationCard = ({
  application,
  onStatusChange,
  onOpenScheduleInterview,
  onOpenAddNote,
}) => {
  const [expanded, setExpanded] = useState(false);

  const candidate = application.candidate || {};
  const job = application.job || {};

  const handleStageSelect = (newStage) => {
    if (newStage !== application.status) {
      onStatusChange(application._id, newStage);
    }
  };

  const getFullResumeUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http')) return url;
    return `http://localhost:5004${url}`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition space-y-4">
      {/* Top Header: Candidate Info & Stage Dropdown */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <img
            src={
              candidate.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                candidate.name || 'Candidate'
              )}&background=6366f1&color=fff`
            }
            alt={candidate.name}
            className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-900">{candidate.name}</h4>
            <p className="text-xs text-brand-600 font-medium">
              {candidate.headline || 'Full Stack Candidate'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Applied for: <strong className="text-slate-600">{job.title}</strong>
            </p>
          </div>
        </div>

        {/* Stage Selector */}
        <div className="shrink-0">
          <select
            value={application.status}
            onChange={(e) => handleStageSelect(e.target.value)}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
          >
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                Stage: {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidate Metadata Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
        <span className="flex items-center gap-1 font-medium">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          Exp: ${Number(application.expectedSalary || 0).toLocaleString()} / yr
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Notice: {application.noticePeriod}
        </span>
        <span className="text-slate-300">•</span>
        <span className="text-[11px] text-slate-400">
          Applied {new Date(application.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Skills Preview */}
      {candidate.skills && candidate.skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {candidate.skills.slice(0, 5).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Scheduled Interview Banner if present */}
      {application.interviewDetails?.scheduledDate && (
        <div className="bg-purple-50/90 border border-purple-200 rounded-xl p-3 text-xs text-purple-900 space-y-1">
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-purple-600" />
              Interview Scheduled
            </span>
            <span className="text-[11px] bg-purple-100 px-2 py-0.5 rounded-md font-bold text-purple-700">
              {application.interviewDetails.mode}
            </span>
          </div>
          <p className="text-[11px] text-purple-700">
            {new Date(application.interviewDetails.scheduledDate).toLocaleDateString()} at{' '}
            {application.interviewDetails.time}
          </p>
          {application.interviewDetails.meetingLink && (
            <a
              href={application.interviewDetails.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 underline hover:text-purple-900"
            >
              Join Call <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Expanded Details: Cover Note, Recruiter Notes */}
      {expanded && (
        <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in text-xs">
          {/* Cover letter */}
          {application.coverLetter && (
            <div>
              <p className="font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Candidate Note:
              </p>
              <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed italic">
                "{application.coverLetter}"
              </p>
            </div>
          )}

          {/* Recruiter Review Notes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                Recruiter Evaluation ({application.recruiterNotes?.length || 0})
              </span>
            </div>
            {application.recruiterNotes && application.recruiterNotes.length > 0 ? (
              <div className="space-y-2">
                {application.recruiterNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-slate-800"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-amber-900">
                        {note.authorName || 'Reviewer'}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(note.rating || 3)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 text-amber-400 fill-amber-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700">{note.note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-[11px]">No internal notes added yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Card Action Bar */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Resume Download / View */}
          <a
            href={getFullResumeUrl(application.resumeUrl)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 transition border border-brand-200"
          >
            <FileText className="w-3.5 h-3.5" />
            View Resume
          </a>

          {/* Schedule Interview Button */}
          <button
            onClick={() => onOpenScheduleInterview(application)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition border border-purple-200"
          >
            <Calendar className="w-3.5 h-3.5" />
            Interview
          </button>

          {/* Add Review Note */}
          <button
            onClick={() => onOpenAddNote(application)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 transition border border-amber-200"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Rate
          </button>
        </div>

        {/* Toggle Expand / Collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition"
        >
          {expanded ? (
            <>
              Hide Notes <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Details ({application.recruiterNotes?.length || 0}) <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
