import React, { useState } from 'react';
import {
  FileCode,
  ShieldCheck,
  Send,
  Sparkles,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  Layers,
} from 'lucide-react';

const API_ENDPOINTS = [
  {
    category: '1. Authentication & Profile',
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/register',
        desc: 'Register new Candidate or Recruiter account',
        auth: 'Public',
        body: '{\n  "name": "Jane Doe",\n  "email": "jane@example.com",\n  "password": "password123",\n  "role": "candidate"\n}',
      },
      {
        method: 'POST',
        path: '/api/auth/login',
        desc: 'Authenticate user & receive JWT token',
        auth: 'Public',
        body: '{\n  "email": "candidate@auspify.com",\n  "password": "password123"\n}',
      },
      {
        method: 'GET',
        path: '/api/auth/me',
        desc: 'Fetch currently authenticated user & bookmarks',
        auth: 'Bearer Token',
      },
      {
        method: 'PUT',
        path: '/api/auth/profile',
        desc: 'Update headline, bio, skills, and experience',
        auth: 'Bearer Token',
      },
      {
        method: 'POST',
        path: '/api/auth/upload-resume',
        desc: 'Upload PDF / DOCX resume file via multipart/form-data',
        auth: 'Bearer Token',
      },
      {
        method: 'POST',
        path: '/api/auth/save-job/:id',
        desc: 'Toggle job bookmark for candidate',
        auth: 'Bearer Token',
      },
    ],
  },
  {
    category: '2. Jobs Catalog & Management',
    endpoints: [
      {
        method: 'GET',
        path: '/api/jobs',
        desc: 'Search, filter by category/type/salary, and paginate active jobs',
        auth: 'Public',
      },
      {
        method: 'GET',
        path: '/api/jobs/:id',
        desc: 'Retrieve full job details, company bio, and similar roles',
        auth: 'Optional Auth',
      },
      {
        method: 'POST',
        path: '/api/jobs',
        desc: 'Create and publish new job posting',
        auth: 'Recruiter & Admin',
        body: '{\n  "title": "Senior Full Stack Engineer",\n  "category": "Engineering",\n  "jobType": "Full-time",\n  "location": "San Francisco, CA",\n  "isRemote": true,\n  "salary": { "min": 120000, "max": 150000 },\n  "description": "..."\n}',
      },
      {
        method: 'PUT',
        path: '/api/jobs/:id',
        desc: 'Update existing job posting',
        auth: 'Job Owner or Admin',
      },
      {
        method: 'DELETE',
        path: '/api/jobs/:id',
        desc: 'Delete job posting & cascade remove applications',
        auth: 'Job Owner or Admin',
      },
      {
        method: 'GET',
        path: '/api/jobs/recruiter/my-jobs',
        desc: 'Fetch all jobs posted by logged-in recruiter with application stats',
        auth: 'Recruiter & Admin',
      },
    ],
  },
  {
    category: '3. Applications & ATS Pipeline',
    endpoints: [
      {
        method: 'POST',
        path: '/api/applications/:jobId',
        desc: 'Submit application with uploaded resume, cover note, and salary expectation',
        auth: 'Candidate',
      },
      {
        method: 'GET',
        path: '/api/applications/my-applications',
        desc: 'List candidate applications with stage timeline & interview details',
        auth: 'Candidate',
      },
      {
        method: 'GET',
        path: '/api/applications/job/:jobId',
        desc: 'Fetch all applications for job or recruiter (ATS Kanban board data)',
        auth: 'Recruiter & Admin',
      },
      {
        method: 'PUT',
        path: '/api/applications/:id/status',
        desc: 'Transition applicant stage (under-review, shortlisted, interview, hired, rejected)',
        auth: 'Recruiter & Admin',
        body: '{\n  "status": "shortlisted"\n}',
      },
      {
        method: 'POST',
        path: '/api/applications/:id/notes',
        desc: 'Record recruiter evaluation note and 1-5 star rating',
        auth: 'Recruiter & Admin',
        body: '{\n  "note": "Excellent technical interview performance",\n  "rating": 5\n}',
      },
      {
        method: 'POST',
        path: '/api/applications/:id/schedule-interview',
        desc: 'Schedule live interview with date, time, mode, and Google Meet/Zoom link',
        auth: 'Recruiter & Admin',
        body: '{\n  "scheduledDate": "2026-11-01",\n  "time": "14:00 EST",\n  "mode": "Google Meet",\n  "meetingLink": "https://meet.google.com/xyz"\n}',
      },
      {
        method: 'DELETE',
        path: '/api/applications/:id',
        desc: 'Candidate withdraws submitted application',
        auth: 'Candidate',
      },
    ],
  },
  {
    category: '4. Administration & Governance',
    endpoints: [
      {
        method: 'GET',
        path: '/api/admin/stats',
        desc: 'System KPIs (total users, active jobs, stage conversion rates, top companies)',
        auth: 'Admin',
      },
      {
        method: 'GET',
        path: '/api/admin/users',
        desc: 'Search & filter registered users with role status',
        auth: 'Admin',
      },
      {
        method: 'PUT',
        path: '/api/admin/users/:id/toggle-status',
        desc: 'Activate or suspend user account',
        auth: 'Admin',
      },
      {
        method: 'GET',
        path: '/api/admin/jobs',
        desc: 'Moderate all job postings across the platform',
        auth: 'Admin',
      },
      {
        method: 'PUT',
        path: '/api/admin/jobs/:id/toggle-featured',
        desc: 'Feature or unfeature job on homepage',
        auth: 'Admin',
      },
    ],
  },
];

const ApiDocs = () => {
  const [copiedPath, setCopiedPath] = useState('');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(text);
    setTimeout(() => setCopiedPath(''), 2000);
  };

  const methodColor = (m) => {
    switch (m) {
      case 'GET':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'POST':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PUT':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DELETE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/30 text-brand-200 border border-brand-400/30">
          <FileCode className="w-4 h-4 text-brand-400" /> Auspify Task 6 API Documentation
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          RESTful API Reference & Postman Guide
        </h1>
        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
          Comprehensive endpoint specifications for TalentPulse. Includes input validation, JWT bearer authentication, ATS stage updates, and Postman testing instructions.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
          <span className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 font-mono text-emerald-400">
            Base URL: http://localhost:5004
          </span>
          <span className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 font-mono text-brand-300">
            Collection: postman/TalentPulse_Job_Portal_API.postman_collection.json
          </span>
        </div>
      </div>

      {/* Postman Testing Guide Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-brand-600" />
          How to Test via Postman
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center">
              1
            </span>
            <p className="font-bold text-slate-900">Import Collection</p>
            <p className="leading-relaxed">
              Open Postman, click <strong>Import</strong>, and select the file located at{' '}
              <code>postman/TalentPulse_Job_Portal_API.postman_collection.json</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center">
              2
            </span>
            <p className="font-bold text-slate-900">Run Login Endpoint</p>
            <p className="leading-relaxed">
              Execute <strong>POST 2. Login (Admin)</strong> or <strong>Login (Recruiter)</strong>. The test script automatically stores the JWT token in your <code>talentpulse_token</code> variable!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center">
              3
            </span>
            <p className="font-bold text-slate-900">Test Protected APIs</p>
            <p className="leading-relaxed">
              Subsequent requests inherit the Bearer Token automatically. Test job creation, candidate applications, interview scheduling, and admin stats.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Credentials Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          Preloaded Demo Credentials
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Password</th>
                <th className="px-4 py-3">Permissions Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              <tr>
                <td className="px-4 py-3 font-sans font-bold text-purple-700">👑 Administrator</td>
                <td className="px-4 py-3 font-bold text-slate-800">admin@auspify.com</td>
                <td className="px-4 py-3">password123</td>
                <td className="px-4 py-3 font-sans">Full administrative control, user suspension, moderation</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-bold text-brand-700">🏢 Recruiter (TechNova)</td>
                <td className="px-4 py-3 font-bold text-slate-800">recruiter@auspify.com</td>
                <td className="px-4 py-3">password123</td>
                <td className="px-4 py-3 font-sans">Post jobs, ATS Kanban, stage updates, interview invites</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-bold text-brand-700">🏢 Recruiter (CloudMatrix)</td>
                <td className="px-4 py-3 font-bold text-slate-800">hr@cloudmatrix.com</td>
                <td className="px-4 py-3">password123</td>
                <td className="px-4 py-3 font-sans">AI roles, ATS pipeline, candidate evaluation notes</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-bold text-emerald-700">💼 Candidate (Yallari)</td>
                <td className="px-4 py-3 font-bold text-slate-800">candidate@auspify.com</td>
                <td className="px-4 py-3">password123</td>
                <td className="px-4 py-3 font-sans">Browse jobs, apply with resume, view interview links, save jobs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Endpoints Reference by Category */}
      <div className="space-y-8">
        {API_ENDPOINTS.map((cat, catIdx) => (
          <div
            key={catIdx}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              {cat.category}
            </h3>

            <div className="space-y-4">
              {cat.endpoints.map((ep, epIdx) => (
                <div
                  key={epIdx}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold border text-[11px] ${methodColor(
                          ep.method
                        )}`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-bold text-slate-800">{ep.path}</span>
                      <button
                        onClick={() => copyToClipboard(ep.path)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                        title="Copy endpoint"
                      >
                        {copiedPath === ep.path ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-semibold self-start sm:self-auto">
                      {ep.auth}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{ep.desc}</p>

                  {ep.body && (
                    <div className="pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Sample Request Body:
                      </p>
                      <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 text-[11px] font-mono overflow-x-auto">
                        {ep.body}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiDocs;
