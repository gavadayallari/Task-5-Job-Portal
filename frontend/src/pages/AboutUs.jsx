import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Target,
  Sparkles,
  ShieldCheck,
  Users,
  Award,
  Globe2,
  TrendingUp,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { label: 'Active Job Listings', value: '120+' },
    { label: 'Verified Companies', value: '20+' },
    { label: 'Specialized Categories', value: '30' },
    { label: 'Indian Tech Hubs', value: '9' },
  ];

  const values = [
    {
      icon: <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: 'Transparent Compensation',
      desc: 'Every listing on JobNova features upfront salary ranges in Indian Rupees (₹ LPA) and clear experience requirements so you never waste time.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: 'Verified Employers Only',
      desc: 'We thoroughly review company credentials and corporate email domains before approving job listings, shielding seekers from scams and ghost postings.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: 'Real-Time Stage Tracking',
      desc: 'No more wondering where your application went. Candidates track all 6 application stages in real-time, from review to interview scheduling and offer.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      title: 'Candidate Empowerment',
      desc: 'With profile resume downloads, bookmarking, and instant interview calendar links, JobNova puts job seekers firmly in control of their career journey.',
    },
  ];

  const leaders = [
    {
      name: 'Vikramaditya Roy',
      role: 'Chief Executive Officer & Co-Founder',
      bio: 'Ex-VP Product at InfoEdge & Naukri. Passionate about reforming tech hiring across India.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Chief Technology Officer',
      bio: 'Former Engineering Director at Google Bengaluru. Architect of scalable recruitment matching systems.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Siddharth Nair',
      role: 'Head of Employer Solutions',
      bio: '12+ years partnering with Fortune 500 tech enterprises and Indian unicorns for bulk talent acquisition.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Pooja Iyer',
      role: 'VP of Trust, Safety & Operations',
      bio: 'Former LinkedIn Policy Specialist overseeing verified company credentialing and user privacy.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
            <Globe2 className="w-3.5 h-3.5" />
            Next-Gen Indian Recruitment Ecosystem
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Connecting India’s Brightest Minds With World-Class Careers
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            JobNova was born out of a desire to eliminate the chaos, hidden salaries, and silent
            rejections common in traditional hiring portals. We combine modern engineering with
            transparent workflows to empower both talent and recruiters.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                {s.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-2">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5" />
              Our Mission
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Democratizing career opportunities across Bengaluru to Indore
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              India boasts the world's most dynamic software and digital workforce. Yet job seekers
              spend hours dealing with stale postings, uncommunicative HR pipelines, and opaque salary
              expectations.
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              JobNova provides a seamless interface where tech talent, designers, data scientists, and
              corporate professionals can connect directly with verified enterprise employers—complete
              with upfront salary ranges in INR LPA, live status tracking, and 1-click video interview
              links.
            </p>
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Zero spam, zero ghost postings — all employers manually reviewed</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Direct recruiter dashboard with live applicant pipeline stages</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Built for Remote, Hybrid, and On-site hubs across India</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                alt="JobNova Collaborative Team"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden sm:block p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Rated #1 Tech Career Portal</h4>
                  <p className="text-[11px] text-slate-500">By 10,000+ Indian engineers in 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Built on Principles We Never Compromise On
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Every feature in JobNova is designed to respect the candidate’s dignity and the employer’s time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  {v.icon}
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{v.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Meet the Leadership Team
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Recruitment veterans and software architects dedicated to building India’s premier career network.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((person, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-5 space-y-1.5">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {person.name}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {person.role}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 leading-relaxed">
                    {person.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dual CTA */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-12 text-white shadow-xl text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold max-w-2xl mx-auto leading-tight">
            Ready to Accelerate Your Career or Build Your Dream Team?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Join thousands of active tech professionals and India’s leading technology companies on JobNova today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/jobs"
              className="px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 shadow-md transition inline-flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" /> Explore Open Roles
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-blue-900/60 hover:bg-blue-900/80 text-white font-bold text-sm border border-white/20 transition inline-flex items-center gap-2"
            >
              Post a Job as Employer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

