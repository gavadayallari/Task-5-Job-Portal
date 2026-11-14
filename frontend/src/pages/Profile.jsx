import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  MapPin,
  Phone,
  Briefcase,
  UploadCloud,
  FileText,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Download,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Camera,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, refreshUser, isJobSeeker, isEmployer } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || '',
    skills: user?.skills || [],
    companyName: user?.companyDetails?.name || user?.company?.name || '',
    companyWebsite: user?.companyDetails?.website || user?.company?.website || '',
    companyAbout: user?.companyDetails?.about || user?.company?.description || '',
    companySize: user?.companyDetails?.size || user?.company?.companySize || '50-200 employees',
    companyLocation: user?.companyDetails?.location || user?.company?.location || '',
  });

  const [experience, setExperience] = useState(user?.experience || []);
  const [education, setEducation] = useState(user?.education || []);
  const [skillInput, setSkillInput] = useState('');

  // Experience form modal state
  const [newExp, setNewExp] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: 'Present',
    description: '',
  });

  // Education form state
  const [newEdu, setNewEdu] = useState({
    degree: '',
    institution: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
    grade: '',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        headline: user.headline || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        skills: user.skills || [],
        companyName: user.companyDetails?.name || user.company?.name || '',
        companyWebsite: user.companyDetails?.website || user.company?.website || '',
        companyAbout: user.companyDetails?.about || user.company?.description || '',
        companySize: user.companyDetails?.size || user.company?.companySize || '50-200 employees',
        companyLocation: user.companyDetails?.location || user.company?.location || '',
      });
      setExperience(user.experience || []);
      setEducation(user.education || []);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (!formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!newExp.title || !newExp.company) return;
    setExperience([...experience, { ...newExp }]);
    setNewExp({ title: '', company: '', location: '', startDate: '', endDate: 'Present', description: '' });
  };

  const handleRemoveExperience = (idx) => {
    setExperience(experience.filter((_, i) => i !== idx));
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!newEdu.degree || !newEdu.institution) return;
    setEducation([...education, { ...newEdu }]);
    setNewEdu({ degree: '', institution: '', fieldOfStudy: '', startYear: '', endYear: '', grade: '' });
  };

  const handleRemoveEducation = (idx) => {
    setEducation(education.filter((_, i) => i !== idx));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMsg({ type: '', text: '' });

      const payload = {
        name: formData.name,
        headline: formData.headline,
        bio: formData.bio,
        phone: formData.phone,
        location: formData.location,
        skills: formData.skills,
        experience,
        education,
      };

      if (isEmployer) {
        payload.companyDetails = {
          name: formData.companyName,
          website: formData.companyWebsite,
          about: formData.companyAbout,
          size: formData.companySize,
          location: formData.companyLocation || formData.location,
        };
      }

      const res = await api.put('/auth/profile', payload);
      if (res.data.success) {
        await refreshUser();
        setStatusMsg({ type: 'success', text: 'Profile changes saved successfully!' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const data = new FormData();
      data.append('avatar', file);
      const res = await api.post('/auth/avatar', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        await refreshUser();
        setStatusMsg({ type: 'success', text: 'Photo uploaded successfully!' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to upload photo' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    try {
      setUploadingResume(true);
      const data = new FormData();
      data.append('resume', resumeFile);
      const res = await api.post('/auth/resume', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        await refreshUser();
        setResumeFile(null);
        setStatusMsg({ type: 'success', text: 'Resume document uploaded successfully!' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to upload resume file' });
    } finally {
      setUploadingResume(false);
    }
  };

  const getFullResumeUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http')) return url;
    const base = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5004';
    return `${base}${url}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors space-y-8">
      {/* Header Profile Summary */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar with Camera upload button */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-3xl overflow-hidden shadow-md">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <label className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white shadow-lg cursor-pointer hover:bg-brand-600 transition">
            <Camera className="w-4 h-4" />
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>

        <div className="text-center sm:text-left space-y-1 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{user?.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {user?.role}
            </span>
          </div>
          <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
            {user?.headline || (isEmployer ? 'Hiring Lead' : 'Job Seeker')}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email} • {user?.location || 'India'}</p>
        </div>
      </div>

      {/* Status Feedback Notification */}
      {statusMsg.text && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs font-semibold ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Resume Management Card (Only for Job Seekers) */}
      {!isEmployer && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-500" />
                Resume Document
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload your latest resume (PDF, DOC, DOCX up to 5MB) for 1-click applications
              </p>
            </div>
            {user?.resumeUrl && (
              <a
                href={getFullResumeUrl(user.resumeUrl)}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Saved Resume</span>
              </a>
            )}
          </div>

          <form onSubmit={handleUploadResume} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 dark:file:bg-brand-950/60 file:text-brand-700 dark:file:text-brand-300"
            />
            <button
              type="submit"
              disabled={!resumeFile || uploadingResume}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition disabled:opacity-40 shrink-0 flex items-center justify-center gap-1.5"
            >
              {uploadingResume && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{uploadingResume ? 'Uploading...' : 'Upload Resume'}</span>
            </button>
          </form>
          {user?.resumeOriginalName && (
            <p className="text-[11px] text-slate-400">
              Current active resume: <strong>{user.resumeOriginalName}</strong>
            </p>
          )}
        </div>
      )}

      {/* Main Profile Edit Form */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Personal Details */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal & Contact Info</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Professional Headline
              </label>
              <input
                type="text"
                name="headline"
                placeholder="e.g. Senior Backend Engineer (Node.js & Go)"
                value={formData.headline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Location (City, Country)
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Bengaluru, India"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              About / Professional Bio
            </label>
            <textarea
              rows="3"
              name="bio"
              placeholder="Brief summary of your background, achievements, and career aspirations..."
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Employer Company Details Card */}
        {isEmployer && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-500" />
              Company Organization Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Official Website
                </label>
                <input
                  type="url"
                  name="companyWebsite"
                  placeholder="https://company.com"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Company Size
                </label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="1-10 employees">1-10 employees</option>
                  <option value="10-50 employees">10-50 employees</option>
                  <option value="50-200 employees">50-200 employees</option>
                  <option value="200-500 employees">200-500 employees</option>
                  <option value="500-1,000 employees">500-1,000 employees</option>
                  <option value="1,000-5,000 employees">1,000-5,000 employees</option>
                  <option value="10,000+ employees">10,000+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Company Headquarters
                </label>
                <input
                  type="text"
                  name="companyLocation"
                  placeholder="e.g. Bengaluru, Karnataka"
                  value={formData.companyLocation}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                About Company
              </label>
              <textarea
                rows="3"
                name="companyAbout"
                placeholder="What does your company build? Highlight culture and engineering mission..."
                value={formData.companyAbout}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        )}

        {/* Skills Tag Manager (Job Seeker) */}
        {!isEmployer && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Technical Skills</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type skill (e.g. React.js, Docker, Python) and press Add..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSkill(e);
                }}
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm"
              >
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience (Job Seeker) */}
        {!isEmployer && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-500" />
              Work Experience ({experience.length})
            </h2>

            {/* Existing Experience Items */}
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{exp.title}</h4>
                    <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">{exp.company} • {exp.location}</p>
                    <p className="text-xs text-slate-400 mt-1">{exp.startDate} - {exp.endDate || 'Present'}</p>
                    {exp.description && <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{exp.description}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Experience Subform */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Add New Position</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Job Title (e.g. Senior Frontend Dev)"
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={newExp.company}
                  onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Start (e.g. Jan 2023)"
                  value={newExp.startDate}
                  onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="End (e.g. Present)"
                  value={newExp.endDate}
                  onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <textarea
                rows="2"
                placeholder="Key contributions and achievements..."
                value={newExp.description}
                onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddExperience}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold"
              >
                + Add to Experience
              </button>
            </div>
          </div>
        )}

        {/* Education (Job Seeker) */}
        {!isEmployer && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-500" />
              Education Details ({education.length})
            </h2>

            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{edu.degree}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{edu.institution} {edu.grade ? `• ${edu.grade}` : ''}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{edu.startYear} - {edu.endYear || edu.year}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Education Subform */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Add Education</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Degree (e.g. B.Tech Computer Science)"
                  value={newEdu.degree}
                  onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Institution / University"
                  value={newEdu.institution}
                  onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Graduation Year (e.g. 2024)"
                  value={newEdu.endYear}
                  onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value })}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Grade / CGPA (e.g. 8.5 CGPA)"
                  value={newEdu.grade}
                  onChange={(e) => setNewEdu({ ...newEdu, grade: e.target.value })}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddEducation}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold"
              >
                + Add to Education
              </button>
            </div>
          </div>
        )}

        {/* Save Changes Floating Action */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition flex items-center gap-2 disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
